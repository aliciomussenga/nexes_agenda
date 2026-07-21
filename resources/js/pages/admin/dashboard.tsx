import { Head, router, useForm, usePage } from '@inertiajs/react';
import { BadgeDollarSign, CalendarDays, Clock3, Pencil, Plus, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

type Service = {
    id: number;
    name: string;
    duration_minutes: number;
    price_cents: number;
    is_active: boolean;
};

type BusinessHour = {
    id: number;
    day_of_week: number;
    opens_at: string;
    closes_at: string;
    is_active: boolean;
};

type PageProps = {
    stats: {
        services: number;
        businessHours: number;
    };
    filters: {
        search: string;
        status: string;
        day_of_week: string | number;
    };
    services: Service[];
    businessHours: BusinessHour[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin', href: '/dashboard' }];

const dayLabels: Record<number, string> = {
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
    6: 'Sábado',
    7: 'Domingo',
};

export default function AdminDashboard() {
    const { stats, filters, services, businessHours } = usePage<PageProps>().props;

    const serviceForm = useForm({
        name: '',
        duration_minutes: 30,
        price_cents: 0,
        is_active: true,
    });

    const hourForm = useForm({
        day_of_week: 1,
        opens_at: '08:00',
        closes_at: '18:00',
        is_active: true,
    });

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="space-y-6 p-4 md:p-6">
                <section className="rounded-3xl border border-sidebar-border/70 bg-gradient-to-br from-[#fff7ed] via-white to-[#ecfeff] p-6 shadow-sm dark:border-sidebar-border dark:from-[#1b1209] dark:via-[#111111] dark:to-[#0d1b1e]">
                    <h1 className="text-3xl font-semibold tracking-tight">Gestão da Agenda</h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Aqui o prestador cria serviços, define horários de funcionamento e mantém o motor de reservas alinhado com a operação.
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border bg-background/80 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Serviços</div>
                            <div className="mt-1 text-2xl font-semibold">{stats.services}</div>
                        </div>
                        <div className="rounded-2xl border bg-background/80 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Horários</div>
                            <div className="mt-1 text-2xl font-semibold">{stats.businessHours}</div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-2">
                    <section className="rounded-3xl border border-sidebar-border/70 bg-background p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Plus className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Novo serviço</h2>
                        </div>

                        <form
                            className="mt-5 grid gap-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                serviceForm.post('/admin/services', {
                                    preserveScroll: true,
                                    onSuccess: () => serviceForm.reset('name', 'duration_minutes', 'price_cents'),
                                });
                            }}
                        >
                            <input className="rounded-lg border px-3 py-2" placeholder="Nome" value={serviceForm.data.name} onChange={(e) => serviceForm.setData('name', e.target.value)} />
                            <input className="rounded-lg border px-3 py-2" type="number" min={5} placeholder="Duração (min)" value={serviceForm.data.duration_minutes} onChange={(e) => serviceForm.setData('duration_minutes', Number(e.target.value))} />
                            <input className="rounded-lg border px-3 py-2" type="number" min={0} placeholder="Preço em centavos" value={serviceForm.data.price_cents} onChange={(e) => serviceForm.setData('price_cents', Number(e.target.value))} />
                            <button className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black" type="submit" disabled={serviceForm.processing}>
                                Criar serviço
                            </button>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-sidebar-border/70 bg-background p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Clock3 className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Novo horário</h2>
                        </div>

                        <form
                            className="mt-5 grid gap-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                hourForm.post('/admin/business-hours', {
                                    preserveScroll: true,
                                    onSuccess: () => hourForm.reset('day_of_week', 'opens_at', 'closes_at'),
                                });
                            }}
                        >
                            <select className="rounded-lg border px-3 py-2" value={hourForm.data.day_of_week} onChange={(e) => hourForm.setData('day_of_week', Number(e.target.value))}>
                                {Object.entries(dayLabels).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <input className="rounded-lg border px-3 py-2" type="time" value={hourForm.data.opens_at} onChange={(e) => hourForm.setData('opens_at', e.target.value)} />
                            <input className="rounded-lg border px-3 py-2" type="time" value={hourForm.data.closes_at} onChange={(e) => hourForm.setData('closes_at', e.target.value)} />
                            <button className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black" type="submit" disabled={hourForm.processing}>
                                Criar horário
                            </button>
                        </form>
                    </section>
                </div>

                <section className="rounded-3xl border border-sidebar-border/70 bg-background p-6 shadow-sm">
                    <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
                        <input
                            className="rounded-lg border px-3 py-2"
                            placeholder="Buscar serviço"
                            defaultValue={filters.search}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    router.get('/dashboard', {
                                        search: (event.currentTarget as HTMLInputElement).value,
                                        status: filters.status,
                                        day_of_week: filters.day_of_week,
                                    }, { preserveState: true, preserveScroll: true });
                                }
                            }}
                        />
                        <select
                            className="rounded-lg border px-3 py-2"
                            defaultValue={filters.status}
                            onChange={(e) => {
                                router.get('/dashboard', {
                                    search: filters.search,
                                    status: e.target.value,
                                    day_of_week: filters.day_of_week,
                                }, { preserveState: true, preserveScroll: true });
                            }}
                        >
                            <option value="all">Todos</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                        <select
                            className="rounded-lg border px-3 py-2"
                            defaultValue={filters.day_of_week}
                            onChange={(e) => {
                                router.get('/dashboard', {
                                    search: filters.search,
                                    status: filters.status,
                                    day_of_week: e.target.value,
                                }, { preserveState: true, preserveScroll: true });
                            }}
                        >
                            <option value="">Todos os dias</option>
                            {Object.entries(dayLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <button
                            className="rounded-lg border px-4 py-2 text-sm"
                            type="button"
                            onClick={() => router.get('/dashboard')}
                        >
                            Limpar
                        </button>
                    </div>

                    <div className="mb-4 flex items-center gap-3">
                        <BadgeDollarSign className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Serviços</h2>
                    </div>
                    <div className="grid gap-3">
                        {services.length === 0 ? (
                            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                                Nenhum serviço cadastrado ainda.
                            </div>
                        ) : (
                            services.map((service) => (
                                <ServiceCard key={service.id} service={service} />
                            ))
                        )}
                    </div>
                </section>

                <section className="rounded-3xl border border-sidebar-border/70 bg-background p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <CalendarDays className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Horários de funcionamento</h2>
                    </div>
                    <div className="grid gap-3">
                        {businessHours.length === 0 ? (
                            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                                Nenhum horário cadastrado ainda.
                            </div>
                        ) : (
                            businessHours.map((hour) => (
                                <BusinessHourCard key={hour.id} hour={hour} />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

function ServiceCard({ service }: { service: Service }) {
    const form = useForm({
        name: service.name,
        duration_minutes: service.duration_minutes,
        price_cents: service.price_cents,
        is_active: service.is_active,
    });

    return (
        <form
            className="rounded-2xl border p-4"
            onSubmit={(event) => {
                event.preventDefault();
                form.put(`/admin/services/${service.id}`, { preserveScroll: true });
            }}
        >
            <div className="grid gap-3 md:grid-cols-[1fr_140px_140px_auto]">
                <input className="rounded-lg border px-3 py-2" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                <input className="rounded-lg border px-3 py-2" type="number" min={5} value={form.data.duration_minutes} onChange={(e) => form.setData('duration_minutes', Number(e.target.value))} />
                <input className="rounded-lg border px-3 py-2" type="number" min={0} value={form.data.price_cents} onChange={(e) => form.setData('price_cents', Number(e.target.value))} />
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black" type="submit" disabled={form.processing}>
                        <Pencil className="h-4 w-4" />
                        Salvar
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm" type="button" onClick={() => router.delete(`/admin/services/${service.id}`, { preserveScroll: true })}>
                        <Trash2 className="h-4 w-4" />
                        Remover
                    </button>
                </div>
            </div>
        </form>
    );
}

function BusinessHourCard({ hour }: { hour: BusinessHour }) {
    const form = useForm({
        day_of_week: hour.day_of_week,
        opens_at: hour.opens_at.slice(0, 5),
        closes_at: hour.closes_at.slice(0, 5),
        is_active: hour.is_active,
    });

    return (
        <form
            className="rounded-2xl border p-4"
            onSubmit={(event) => {
                event.preventDefault();
                form.put(`/admin/business-hours/${hour.id}`, { preserveScroll: true });
            }}
        >
            <div className="grid gap-3 md:grid-cols-[1fr_120px_120px_auto]">
                <select className="rounded-lg border px-3 py-2" value={form.data.day_of_week} onChange={(e) => form.setData('day_of_week', Number(e.target.value))}>
                    {Object.entries(dayLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                <input className="rounded-lg border px-3 py-2" type="time" value={form.data.opens_at} onChange={(e) => form.setData('opens_at', e.target.value)} />
                <input className="rounded-lg border px-3 py-2" type="time" value={form.data.closes_at} onChange={(e) => form.setData('closes_at', e.target.value)} />
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black" type="submit" disabled={form.processing}>
                        <Pencil className="h-4 w-4" />
                        Salvar
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm" type="button" onClick={() => router.delete(`/admin/business-hours/${hour.id}`, { preserveScroll: true })}>
                        <Trash2 className="h-4 w-4" />
                        Remover
                    </button>
                </div>
            </div>
        </form>
    );
}

AdminDashboard.layout = {
    breadcrumbs,
};
