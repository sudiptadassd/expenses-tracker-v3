export const generateDummyData = () => {
    const minBagId = 'min-bag-id';
    const pocketId = 'pocket-id';

    const capitals = [
        { id: minBagId, name: 'Min Bag', color: 'indigo', createdAt: '2026-01-12T00:00:00.000Z' },
        { id: pocketId, name: 'Pocket', color: 'emerald', createdAt: '2026-01-12T00:00:00.000Z' }
    ];

    const sources = [
        {
            id: 's1',
            capitalId: minBagId,
            title: '100 not 2',
            breakdown: '100*2',
            amount: 200,
            date: '2026-01-12T08:00:00.000Z'
        },
        {
            id: 's2',
            capitalId: minBagId,
            title: 'rechki',
            breakdown: '36',
            amount: 36,
            date: '2026-01-12T08:05:00.000Z'
        },
        {
            id: 's3',
            capitalId: pocketId,
            title: 'khuchro 20+20+10+10',
            breakdown: '20+20+10+10',
            amount: 60,
            date: '2026-01-12T09:00:00.000Z'
        },
        {
            id: 's4',
            capitalId: pocketId,
            title: 'khuchro 20+20+10',
            breakdown: '20+20+10',
            amount: 50,
            date: '2026-01-12T09:05:00.000Z'
        }
    ];

    const expenses = [
        {
            id: 'e1',
            capitalId: pocketId,
            title: 'vat',
            reason: 'food',
            amount: 30,
            date: '2026-01-12T13:00:00.000Z',
            beforeBalance: 110,
            afterBalance: 80
        },
        {
            id: 'e2',
            capitalId: pocketId,
            title: 'asansol bus',
            reason: 'travel',
            amount: 30,
            date: '2026-01-12T13:30:00.000Z',
            beforeBalance: 80,
            afterBalance: 50
        },
        {
            id: 'e3',
            capitalId: pocketId,
            title: 'cycle vara',
            reason: 'travel',
            amount: 10,
            date: '2026-01-12T14:00:00.000Z',
            beforeBalance: 50,
            afterBalance: 40
        },
        {
            id: 'e4',
            capitalId: minBagId,
            title: 'boot selai',
            reason: 'repair',
            amount: 50,
            date: '2026-01-12T15:00:00.000Z',
            beforeBalance: 236,
            afterBalance: 186
        }
    ];

    // Re-calculate transactions for dummy data
    const transactions = [
        // Min Bag Transactions
        {
            id: 't1',
            type: 'CREDIT',
            capitalId: minBagId,
            amount: 200,
            balanceBefore: 0,
            balanceAfter: 200,
            date: '2026-01-12T08:00:00.000Z',
            note: '100 not 2',
            referenceId: 's1'
        },
        {
            id: 't2',
            type: 'CREDIT',
            capitalId: minBagId,
            amount: 36,
            balanceBefore: 200,
            balanceAfter: 236,
            date: '2026-01-12T08:05:00.000Z',
            note: 'rechki',
            referenceId: 's2'
        },
        {
            id: 't3',
            type: 'DEBIT',
            capitalId: minBagId,
            amount: 50,
            balanceBefore: 236,
            balanceAfter: 186,
            date: '2026-01-12T15:00:00.000Z',
            note: 'boot selai',
            referenceId: 'e4'
        },
        // Pocket Transactions
        {
            id: 't4',
            type: 'CREDIT',
            capitalId: pocketId,
            amount: 60,
            balanceBefore: 0,
            balanceAfter: 60,
            date: '2026-01-12T09:00:00.000Z',
            note: 'khuchro 20+20+10+10',
            referenceId: 's3'
        },
        {
            id: 't5',
            type: 'CREDIT',
            capitalId: pocketId,
            amount: 50,
            balanceBefore: 60,
            balanceAfter: 110,
            date: '2026-01-12T09:05:00.000Z',
            note: 'khuchro 20+20+10',
            referenceId: 's4'
        },
        {
            id: 't6',
            type: 'DEBIT',
            capitalId: pocketId,
            amount: 30,
            balanceBefore: 110,
            balanceAfter: 80,
            date: '2026-01-12T13:00:00.000Z',
            note: 'vat',
            referenceId: 'e1'
        },
        {
            id: 't7',
            type: 'DEBIT',
            capitalId: pocketId,
            amount: 30,
            balanceBefore: 80,
            balanceAfter: 50,
            date: '2026-01-12T13:30:00.000Z',
            note: 'asansol bus',
            referenceId: 'e2'
        },
        {
            id: 't8',
            type: 'DEBIT',
            capitalId: pocketId,
            amount: 10,
            balanceBefore: 50,
            balanceAfter: 40,
            date: '2026-01-12T14:00:00.000Z',
            note: 'cycle vara',
            referenceId: 'e3'
        }
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return { capitals, sources, expenses, transactions };
};
