import { DemoLog } from '@/types/demo';
import { IndustryDistribution, SessionTrend, PopularIdea } from '@/types/api';

export function calculateIndustryDistribution(logs: DemoLog[]): IndustryDistribution[] {
  if (logs.length === 0) return [];
  const map = new Map<string, number>();
  for (const log of logs) {
    const key = log.industry || '기타';
    map.set(key, (map.get(key) || 0) + 1);
  }
  const total = logs.length;
  return Array.from(map.entries())
    .map(([industry, count]) => ({
      industry,
      count,
      percentage: Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);
}

export function calculateSessionTrend(logs: DemoLog[]): SessionTrend[] {
  if (logs.length === 0) return [];
  const map = new Map<number, number>();
  for (const log of logs) {
    const hour = new Date(log.timestamp).getUTCHours();
    map.set(hour, (map.get(hour) || 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([hour, count]) => ({ hour: `${hour}시`, count }));
}

export function extractPopularIdeas(logs: DemoLog[]): PopularIdea[] {
  if (logs.length === 0) return [];
  const map = new Map<string, number>();
  for (const log of logs) {
    if (log.projectIdea) {
      map.set(log.projectIdea, (map.get(log.projectIdea) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([idea, count]) => ({ idea, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
