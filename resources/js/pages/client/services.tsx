import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

type Service = {
    id: number;
    name: string;
    duration_minutes: number;
    price_cents: number;
};

type PageProps = {
    services: Service[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Serviços', href: '/servicos' }];

export default function ClientServices() {
    const { services } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Serviços" />
            <div className="space-y-6 p-4 md:p-6">
                <section className="rounded-3xl border border-sidebar-border/70 bg-gradient-to-br from-[#f0f9ff] via-white to-[#fef3c7] p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5" />
                        <h1 className="text-3xl font-semibold tracking-tight">Serviços disponíveis</h1>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Veja o catálogo ativo e avance para a tela de reserva quando estiver pronto.
                    </p>
                </section>

                <section className="grid gap-3">
                    {services.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                            Nenhum serviço ativo no momento.
                        </div>
                    ) : (
                        services.map((service) => (
                            <div key={service.id} className="flex items-center justify-between rounded-2xl border bg-background p-4">
                                <div>
                                    <div className="font-medium">{service.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {service.duration_minutes} min · {service.price_cents / 100} Kz
                                    </div>
                                </div>
                                <Link className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black" href={`/reservas?service_id=${service.id}`} prefetch>
                                    Reservar
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </>
    );
}

ClientServices.layout = {
    breadcrumbs,
};
