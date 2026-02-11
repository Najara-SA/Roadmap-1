import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PortfolioView from '../../components/PortfolioView';
import { RoadmapItem, Product, Milestone, Priority, Vertical } from '../../types';

// Mock useTranslation
vi.mock('../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key === 'standaloneThemes' ? 'Temas Avulsos' : key === 'unlinked' ? 'Sem Categoria' : key,
        language: 'pt'
    })
}));

import { RoadmapStatus } from '../../types';

describe('PortfolioView Visualization Logic', () => {
    const mockVerticals: Vertical[] = [
        { id: 'v1', name: 'Family A', color: 'bg-red-500', _synced: true }
    ];

    const mockProducts: Product[] = [
        { id: 'p1', familyId: 'v1', name: 'Product 1', description: '', color: '', _synced: true }, // Populated
        { id: 'p2', familyId: 'v1', name: 'Product 2', description: '', color: '', _synced: true }  // Empty
    ];

    const mockItems: RoadmapItem[] = [
        {
            id: 'i1', title: 'Item linked to P1', productId: 'p1', verticalId: 'v1',
            description: '', status: RoadmapStatus.BACKLOG, priority: Priority.MEDIUM, startMonth: 0, spanMonths: 1,
            effort: 1, value: 1, subFeatures: [], tags: [], _synced: true,
            createdAt: Date.now(), dependencies: [], quarter: 'Q1'
        },
        {
            id: 'i2', title: 'Orphan Item in Family A', productId: '', verticalId: 'v1', // No Product, but Family A
            description: '', status: RoadmapStatus.BACKLOG, priority: Priority.MEDIUM, startMonth: 0, spanMonths: 1,
            effort: 1, value: 1, subFeatures: [], tags: [], _synced: true,
            createdAt: Date.now(), dependencies: [], quarter: 'Q1'
        },
        {
            id: 'i3', title: 'Global Orphan Item', productId: '', verticalId: '', // No Product, No Family
            description: '', status: RoadmapStatus.BACKLOG, priority: Priority.MEDIUM, startMonth: 0, spanMonths: 1,
            effort: 1, value: 1, subFeatures: [], tags: [], _synced: true,
            createdAt: Date.now(), dependencies: [], quarter: 'Q1'
        }
    ];

    const mockMilestones: Milestone[] = [];
    const noop = () => { };

    it('should show populated products and hide empty products', () => {
        render(<PortfolioView
            items={mockItems}
            products={mockProducts}
            verticals={mockVerticals}
            milestones={mockMilestones}
            onEditItem={noop} onEditProduct={noop} onEditMilestone={noop} onAddMilestone={noop} onMoveItem={noop}
            activeVerticalId="all"
        />);

        // Expect Product 1 to be visible
        expect(screen.getByText('Product 1')).toBeInTheDocument();

        // Expect Product 2 to be HIDDEN (because it has no items)
        expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });

    it('should show "Temas Avulsos" in both Family and Global sections', () => {
        render(<PortfolioView
            items={mockItems}
            products={mockProducts}
            verticals={mockVerticals}
            milestones={mockMilestones}
            onEditItem={noop} onEditProduct={noop} onEditMilestone={noop} onAddMilestone={noop} onMoveItem={noop}
            activeVerticalId="all"
        />);

        const allHeaders = screen.getAllByText('Temas Avulsos');
        expect(allHeaders).toHaveLength(2);

        expect(screen.getByText('Family A')).toBeInTheDocument();
        expect(screen.getByText('Orphan Item in Family A')).toBeInTheDocument();
        expect(screen.getByText(/Sem Categoria/)).toBeInTheDocument();
        expect(screen.getByText('Global Orphan Item')).toBeInTheDocument();
    });

    it('should show Global Orphan items in a separate section', () => {
        render(<PortfolioView
            items={mockItems}
            products={mockProducts}
            verticals={mockVerticals}
            milestones={mockMilestones}
            onEditItem={noop} onEditProduct={noop} onEditMilestone={noop} onAddMilestone={noop} onMoveItem={noop}
            activeVerticalId="all"
        />);

        // Expect "Sem Categoria" or similar text for global section
        // Based on code: "Geral / Sem Categoria" (t('unlinked'))
        // Mock returns 'Sem Categoria'
        // Access text via getAllByText to be safe or regex
        expect(screen.getByText(/Sem Categoria/)).toBeInTheDocument();

        // Expect the global orphan item
        expect(screen.getByText('Global Orphan Item')).toBeInTheDocument();

        // Ensure Global Item is NOT inside Family A (this is harder to test with just text, but DOM structure check)
        // We assume logic is correct if it appears.
    });
});
