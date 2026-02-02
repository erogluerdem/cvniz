const axios = require('axios');
const { recordEvent } = require('../utils/logger');
const Sentry = require('@sentry/node');

class GoogleCalendarService {
    constructor() {
        this.connections = new Map();
        this.events = new Map();
        this.eventTypes = ['interview', 'deadline', 'meeting', 'reminder'];
    }

    async connectGoogleCalendar(userId, accessToken, refreshToken, calendarId) {
        try {
            // Google Calendar API ile doğrula
            const response = await axios.get(
                'https://www.googleapis.com/calendar/v3/users/me/calendarList',
                {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }
            );

            if (!response.data.items || response.data.items.length === 0) {
                throw new Error('Google Calendar erişimi başarısız');
            }

            const connectionId = `gcal_${userId}_${Date.now()}`;
            this.connections.set(connectionId, {
                userId,
                accessToken,
                refreshToken,
                calendarId: calendarId || 'primary',
                connectedAt: new Date(),
                active: true,
                tokenExpiresAt: new Date(Date.now() + 3600000)
            });

            recordEvent({
                type: 'google_calendar_connected',
                userId,
                calendarId
            });

            return {
                connectionId,
                calendar: calendarId || 'primary',
                status: 'connected'
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async createEvent(userId, connectionId, eventData) {
        try {
            const connection = this.connections.get(connectionId);
            if (!connection || connection.userId !== userId || !connection.active) {
                throw new Error('Geçerli bağlantı bulunamadı');
            }

            const event = {
                summary: eventData.title || 'Etkinlik',
                description: eventData.description || '',
                start: {
                    dateTime: eventData.startTime || new Date().toISOString(),
                    timeZone: eventData.timezone || 'UTC'
                },
                end: {
                    dateTime: eventData.endTime || new Date(Date.now() + 3600000).toISOString(),
                    timeZone: eventData.timezone || 'UTC'
                },
                location: eventData.location || '',
                attendees: eventData.attendees || [],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 10 }
                    ]
                }
            };

            const response = await axios.post(
                `https://www.googleapis.com/calendar/v3/calendars/${connection.calendarId}/events`,
                event,
                {
                    headers: { 'Authorization': `Bearer ${connection.accessToken}` }
                }
            );

            const eventId = `event_${userId}_${response.data.id}`;
            this.events.set(eventId, {
                userId,
                googleEventId: response.data.id,
                connectionId,
                eventType: eventData.type || 'reminder',
                title: eventData.title,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                createdAt: new Date(),
                synced: true
            });

            recordEvent({
                type: 'google_calendar_event_created',
                userId,
                eventId,
                eventType: eventData.type
            });

            return {
                eventId: response.data.id,
                status: 'created',
                htmlLink: response.data.htmlLink
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async syncInterviewsToCalendar(userId, interviews) {
        try {
            const connections = Array.from(this.connections.values())
                .filter(c => c.userId === userId && c.active);

            for (const connection of connections) {
                for (const interview of interviews) {
                    if (!interview.scheduledTime) {continue;}

                    try {
                        await this.createEvent(userId, connection.connectionId, {
                            title: `Röportaj: ${interview.position || 'Pozisyon'}`,
                            description: `Şirket: ${interview.company || 'N/A'}\nTür: Video Röportajı`,
                            startTime: new Date(interview.scheduledTime).toISOString(),
                            endTime: new Date(
                                new Date(interview.scheduledTime).getTime() + 3600000
                            ).toISOString(),
                            type: 'interview',
                            timezone: 'Europe/Istanbul',
                            location: 'Video Conference'
                        });
                    } catch (err) {
                        recordEvent({
                            type: 'google_calendar_sync_failed',
                            userId,
                            interviewId: interview._id,
                            error: err.message
                        });
                    }
                }
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    async syncDeadlinesToCalendar(userId, deadlines) {
        try {
            const connections = Array.from(this.connections.values())
                .filter(c => c.userId === userId && c.active);

            for (const connection of connections) {
                for (const deadline of deadlines) {
                    if (!deadline.dueDate) {continue;}

                    try {
                        await this.createEvent(userId, connection.connectionId, {
                            title: `Son Tarih: ${deadline.title || 'Başvuru'}`,
                            description: deadline.description || 'Başvuru son tarihi',
                            startTime: new Date(deadline.dueDate).toISOString(),
                            endTime: new Date(
                                new Date(deadline.dueDate).getTime() + 86400000
                            ).toISOString(),
                            type: 'deadline',
                            timezone: 'Europe/Istanbul'
                        });
                    } catch (err) {
                        recordEvent({
                            type: 'google_calendar_deadline_sync_failed',
                            userId,
                            deadlineId: deadline._id,
                            error: err.message
                        });
                    }
                }
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    async getUpcomingEvents(userId, connectionId, days = 30) {
        try {
            const connection = this.connections.get(connectionId);
            if (!connection || connection.userId !== userId || !connection.active) {
                throw new Error('Geçerli bağlantı bulunamadı');
            }

            const now = new Date();
            const future = new Date(now.getTime() + days * 86400000);

            const response = await axios.get(
                `https://www.googleapis.com/calendar/v3/calendars/${connection.calendarId}/events`,
                {
                    headers: { 'Authorization': `Bearer ${connection.accessToken}` },
                    params: {
                        timeMin: now.toISOString(),
                        timeMax: future.toISOString(),
                        singleEvents: true,
                        orderBy: 'startTime'
                    }
                }
            );

            return {
                events: response.data.items || [],
                total: (response.data.items || []).length
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async listConnections(userId) {
        return Array.from(this.connections.values())
            .filter(c => c.userId === userId)
            .map(c => ({
                connectionId: c.connectionId,
                calendar: c.calendarId,
                active: c.active,
                connectedAt: c.connectedAt
            }));
    }

    async disconnectGoogleCalendar(userId, connectionId) {
        const connection = this.connections.get(connectionId);

        if (!connection || connection.userId !== userId) {
            throw new Error('Bağlantı bulunamadı');
        }

        // İlişkili etkinlikleri temizle
        for (const [key, event] of this.events.entries()) {
            if (event.connectionId === connectionId) {
                this.events.delete(key);
            }
        }

        this.connections.delete(connectionId);

        recordEvent({
            type: 'google_calendar_disconnected',
            userId,
            connectionId
        });

        return { message: 'Google Calendar bağlantısı kesildi' };
    }

    async getSyncStats(userId) {
        const userConnections = Array.from(this.connections.values())
            .filter(c => c.userId === userId);

        const userEvents = Array.from(this.events.values())
            .filter(e => e.userId === userId);

        return {
            totalConnections: userConnections.length,
            activeConnections: userConnections.filter(c => c.active).length,
            totalSyncedEvents: userEvents.length,
            byType: this.eventTypes.reduce((acc, type) => {
                acc[type] = userEvents.filter(e => e.eventType === type).length;
                return acc;
            }, {})
        };
    }
}

module.exports = GoogleCalendarService;
