import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Trash2, Plus, Clock3, BadgeDollarSign, CalendarDays } from 'lucide-react';
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
    const { services, businessHours } = usePage<PageProps>().props;

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
                    <div className="mb-4 flex items-center gap-3">
                        <BadgeDollarSign className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Serviços</h2>
                    </div>
                    <div className="grid gap-3">
                        {services.map((service) => (
                            <div key={service.id} className="flex items-center justify-between rounded-2xl border p-4">
                                <div>
                                    <div className="font-medium">{service.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {service.duration_minutes} min · {service.price_cents / 100} Kz
                                    </div>
                                </div>
                                <button
                                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                                    onClick={() => router.delete(`/admin/services/${service.id}`, { preserveScroll: true })}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-sidebar-border/70 bg-background p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <CalendarDays className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Horários de funcionamento</h2>
                    </div>
                    <div className="grid gap-3">
                        {businessHours.map((hour) => (
                            <div key={hour.id} className="flex items-center justify-between rounded-2xl border p-4">
                                <div>
                                    <div className="font-medium">{dayLabels[hour.day_of_week] ?? `Dia ${hour.day_of_week}`}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {hour.opens_at} - {hour.closes_at}
                                    </div>
                                </div>
                                <button
                                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                                    onClick={() => router.delete(`/admin/business-hours/${hour.id}`, { preserveScroll: true })}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs,
};
