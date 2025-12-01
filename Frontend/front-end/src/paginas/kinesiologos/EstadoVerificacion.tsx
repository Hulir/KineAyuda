// src/paginas/kinesiologos/EstadoVerificacion.tsx
export default function EstadoVerificacion() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="card max-w-lg p-10 text-center fade">

                <h1 className="text-3xl font-bold text-purple-700">
                    Tu cuenta está en revisión
                </h1>

                <p className="text-gray-700 mt-4">
                    Hemos recibido tu información y documentos.
                    Nuestro equipo está validando tu identidad y tu profesión.
                </p>

                <p className="text-gray-700 mt-2">
                    Te notificaremos por correo cuando tu cuenta sea aprobada.
                </p>

            </div>
        </div>
    );
}
