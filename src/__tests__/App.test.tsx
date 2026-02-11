import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import * as supabaseLib from '../../lib/supabase';
import { localDB } from '../../lib/persistence';


// Mock dependências
vi.mock('../../lib/persistence', () => ({
    localDB: {
        load: vi.fn(),
        save: vi.fn()
    }
}));

// Mock Supabase Client
const mockSupabase = {
    from: vi.fn(),
};

vi.mock('../../lib/supabase', () => ({
    getSupabaseClient: vi.fn(() => mockSupabase),
    isSupabaseReady: vi.fn(() => true)
}));

describe('App Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('preserva dados locais não sincronizados (_synced: false) ao sincronizar com nuvem vazia', async () => {
        // 1. Mock Local Data
        // Simula que temos um produto CRIADO LOCALMENTE (novo) que ainda não foi pro servidor
        (localDB.load as any).mockResolvedValue({
            items: [{
                id: 'i1',
                productId: 'p1',
                verticalId: 'f1',
                title: 'Item Local',
                status: 'Planning',
                startMonth: 0,
                spanMonths: 1,
                _synced: false
            }],
            products: [{ id: 'p1', name: 'Product Local', familyId: 'f1', _synced: false }],
            milestones: [],
            verticals: [{ id: 'f1', name: 'Family Local', color: 'bg-blue-500', _synced: false }]
        });

        // 2. Mock Cloud Data (Vazio)
        // Simula falha de salva anterior, ou dispositivo novo, ou DB limpo
        const selectMock = vi.fn().mockResolvedValue({ data: [], error: null });
        (mockSupabase.from as any).mockReturnValue({
            select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
                then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
            })
        });

        render(<App />);

        // 3. Verifica se o item PERMANECE na tela após o sync
        // Como marcamos _synced: false, a lógica de merge deve mantê-lo.
        await waitFor(() => expect(screen.getByText('Product Local')).toBeInTheDocument());
    });
});
