import { RoadmapItem, RoadmapStatus } from '../types';

export const calculateQuarterProgress = (items: RoadmapItem[], quarter: string): number => {
    const quarterItems = items.filter(i => i.quarter === quarter);
    if (quarterItems.length === 0) return 0;

    const totalProgress = quarterItems.reduce((acc, item) => {
        // If item has subfeatures, use that %
        const totalSub = (item.subFeatures || []).length;
        if (totalSub > 0) {
            const completedSub = (item.subFeatures || []).filter(sf => sf.isCompleted).length;
            return acc + (completedSub / totalSub);
        }
        // If no subfeatures, check status
        if (item.status === RoadmapStatus.COMPLETED) return acc + 1;
        return acc; // 0
    }, 0);

    return Math.round((totalProgress / quarterItems.length) * 100);
};
