<style>
    .header-info {
        background: white;
        border-radius: 4px;
        padding: 16px 20px;
        margin: 16px 0;
        box-shadow: var(--shadow-sm);
        border-left: 4px solid var(--primary);
    }

    .info-badges {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        align-items: center;
    }

    .badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--light);
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .badge:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
    }

    .badge-icon {
        font-size: 1rem;
    }

    .badge-text {
        color: var(--dark);
        text-transform: capitalize;
    }

    .device-badge {
        background: rgba(0, 123, 255, 0.1);
        border: 1px solid rgba(0, 123, 255, 0.2);
    }

    .type-badge {
        background: rgba(40, 167, 69, 0.1);
        border: 1px solid rgba(40, 167, 69, 0.2);
    }

    .date-badge {
        background: rgba(255, 193, 7, 0.1);
        border: 1px solid rgba(255, 193, 7, 0.2);
    }

    @media (max-width: 768px) {
        .header-info {
            padding: 12px 16px;
            margin: 12px 0;
        }

        .info-badges {
            gap: 12px;
        }

        .badge {
            padding: 6px 10px;
            font-size: 0.8rem;
        }
    }

    @media (max-width: 480px) {
        .info-badges {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
        }

        .badge {
            justify-content: center;
        }
    }
</style>
