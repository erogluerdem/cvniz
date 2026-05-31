import React, { memo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const geoUrl =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const WorldMap = ({ data = [] }) => {
    // data format: [{ country: "Turkey", count: 10 }, ...]

    // Transform data to map by country name or ISO code. 
    // For simplicity, we assume country name matching for now or robust usage would use ISO codes backend.
    // The geoUrl uses names mostly.

    const maxValue = Math.max(...data.map(d => d.count), 0);

    const colorScale = scaleLinear()
        .domain([0, maxValue || 1])
        .range(["#EAEAEC", "#06B6D4"]); // Light gray to Cyan

    const getCount = (geoName) => {
        const found = data.find(d => d.country === geoName || (d.country === 'Turkey' && geoName === 'Turkey'));
        return found ? found.count : 0;
    };

    return (
        <div className="w-full h-[400px] bg-slate-50/50 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
            <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}>
                <ZoomableGroup>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const cur = getCount(geo.properties.name);
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={cur ? colorScale(cur) : "#F5F5F5"}
                                        stroke="#D6D6DA"
                                        style={{
                                            default: { outline: "none" },
                                            hover: { fill: "#F53", outline: "none" },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </div>
    );
};

export default memo(WorldMap);
