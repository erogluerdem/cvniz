import * as m from 'lucide-react';
const keys = new Set(Object.keys(m));
const toCheck = ['Signature','ShieldLayer','Verified','Building2','PenTool','Feather','Scroll','Landmark','Compass','Newspaper','Scale','Gavel','FileText','BarChart','PieChart','Building','BadgeCheck','CheckCircle','CheckCircle2','MoreHorizontal','Store','Ruler','Crown','Trophy','Box','Stethoscope','FlaskConical','ShieldAlert','Thermometer','UserCheck','Quote','Heart','Pen','Book','Map','ActivitySquare','Hexagon','Terminal','ShieldCheck','Radio','Eye','Target','Power','ZapOff','Brain','GitBranch','Binary','Fingerprint','Unlink','TrendingUp','Users'];
toCheck.forEach(name => { console.log(name + ':', keys.has(name) ? 'YES' : 'NO'); });
