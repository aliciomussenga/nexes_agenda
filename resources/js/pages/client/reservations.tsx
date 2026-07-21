import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CalendarClock, Clock3, Sparkles } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

type Service = {
    id: number;
    name: string;
    duration_minutes: number;
    price_cents: number;
};

type Appointment = {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
    service: {
        id: number;
        name: string;
    };
};

type Slot = {
    start_time: string;
    end_time: string;
    available: boolean;
};

type PageProps = {
    services: Service[];
    selectedServiceId?: number | null;
    date: string;
    slots: Slot[];
    myAppointments: Appointment[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Reservas', href: '/reservas' }];

export default function ClientReservations() {
    const { services, selectedServiceId, date, slots, myAppointments } = usePage<PageProps>().props;
    const form = useForm({
        service_id: selectedServiceId ?? '',
        date,
    });

    const bookingForm = useForm({
        service_id: selectedServiceId ?? '',
        start_time: '',
    });

    return (
        <>
            <Head title="Reservas" />
            <div className="space-y-6 p-4 md:p-6">
                <section className="rounded-3xl border border-sidebar-border/70 bg-gradient-to-br from-[#f0f9ff] via-white to-[#fef3c7] p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5" />
                        <h1 className="text-3xl font-semibold tracking-tight">Reservar horário</h1>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Escolhe um serviço, seleciona a data e reserva apenas os horários realmente disponíveis.
                    </p>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl border border-sidebar-border/70 bg-background p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <CalendarClock className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Escolher serviço e data</h2>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_180px_auto]">
                            <select className="rounded-lg border px-3 py-2" value={form.data.service_id} onChange={(e) => form.setData('service_id', Number(e.target.value))}>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} · {service.duration_minutes} min
                                    </option>
                                ))}
                            </select>
                            <input className="rounded-lg border px-3 py-2" type="date" value={form.data.date} onChange={(e) => form.setData('date', e.target.value)} />
                            <button
                                className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
                                onClick={() => router.get('/reservas', form.data, { preserveState: true, preserveScroll: true })}
                            >
                                Ver horários
                            </button>
                        </div>

                        <div className="mt-6 grid gap-3">
                            {slots.length === 0 ? (
                                <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                                    Nenhum horário disponível para este dia.
                                </div>
                            ) : (
                                slots.map((slot) => (
                                    <button
                                        key={slot.start_time}
                                        className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                                            slot.available ? 'hover:border-black' : 'cursor-not-allowed opacity-50'
                                        }`}
                                        disabled={!slot.available}
                                        onClick={() => {
                                            bookingForm.setData('service_id', Number(form.data.service_id));
                                            bookingForm.setData('start_time', slot.start_time);
                                        }}
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {slot.start_time.slice(11, 16)} - {slot.end_time.slice(11, 16)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{slot.available ? 'Disponível' : 'Indisponível'}</div>
                                        </div>
                                        <Clock3 className="h-4 w-4" />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-sidebar-border/70 bg-background p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Clock3 className="h-5 w-5" />
                                <h2 className="text-lg font-semibold">Confirmar reserva</h2>
                            </div>

                            <form
                                className="mt-5 grid gap-4"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    bookingForm.post('/reservas', {
                                        preserveScroll: true,
                                        onSuccess: () => bookingForm.reset('start_time'),
                                    });
                                }}
                            >
                                <input type="hidden" value={bookingForm.data.service_id} readOnly />
                                <input className="rounded-lg border px-3 py-2" type="text" value={bookingForm.data.start_time || 'Selecione um horário'} readOnly />
                                <button className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black" type="submit" disabled={!bookingForm.data.start_time || bookingForm.processing}>
                                    Reservar horário
                                </button>
                            </form>
                        </div>

                        <div className="rounded-3xl border border-sidebar-border/70 bg-background p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <Clock3 className="h-5 w-5" />
                                <h2 className="text-lg font-semibold">Minhas reservas</h2>
                            </div>
                            <div className="grid gap-3">
                                {myAppointments.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                                        Você ainda não fez nenhuma reserva.
                                    </div>
                                ) : (
                                    myAppointments.map((appointment) => (
                                        <div key={appointment.id} className="rounded-2xl border p-4">
                                            <div className="font-medium">{appointment.service?.name ?? 'Serviço'}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {appointment.start_time.slice(0, 16).replace('T', ' ')} até {appointment.end_time.slice(11, 16)}
                                            </div>
                                            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{appointment.status}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

ClientReservations.layout = {
    breadcrumbs,
};
