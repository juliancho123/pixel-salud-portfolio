import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCarritoStore } from '../store/useCarritoStore';
import { useAuthStore } from '../store/useAuthStore';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';

const CheckoutSuccess = () => {
    const navigate = useNavigate(); 
    const [searchParams] = useSearchParams();
    const vaciarCarritoLocal = useCarritoStore(state => state.vaciarCarrito);
    const { token } = useAuthStore();
    const [countdown, setCountdown] = useState(3);

    // CORRECCIÓN CLAVE: Usar ruta relativa para que funcione en Vercel y Localhost
    const SUCCESS_URL = '/perfil/mis-compras';

    const clearCartInDB = useCallback(async () => {
        if (!token) {
            console.warn("❌ Token no disponible. No se puede limpiar el carrito en DB. Asumiendo que el webhook lo hizo.");
            return;
        }

        try {
            const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const urlApiCompleta = `${backendUrl}/mercadopago/clearUserCart`; 

            const response = await fetch(urlApiCompleta, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                    auth: `Bearer ${token}`, 
                },
            });

            if (response.ok) {
                console.log('✅ Carrito limpiado en la base de datos (DELETE API).');
            } else {
                const errorData = await response.json();
                console.error('❌ Error al limpiar carrito en DB:', errorData.message);
            }
        } catch (error) {
            console.error('❌ Error de conexión al limpiar carrito:', error);
        }
    }, [token]);

    useEffect(() => {
        const status = searchParams.get('status');
        
        vaciarCarritoLocal();

        if (status === 'approved' && token) {
             clearCartInDB();
        }

        let currentCount = 3;
        const timer = setInterval(() => {
            currentCount -= 1;
            setCountdown(currentCount);
            
            if (currentCount <= 0) {
                clearInterval(timer);
                // Cambio window.location.replace por navigate de react-router
                navigate(SUCCESS_URL, { replace: true }); 
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [searchParams, vaciarCarritoLocal, token, clearCartInDB, navigate]); 

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
                <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    ¡Pago Exitoso!
                </h1>

                {/* Mensaje */}
                <p className="text-gray-600 mb-6">
                    Tu compra ha sido procesada correctamente. El pedido está listo para ser retirado en nuestra tienda.
                </p>

                {/* Información adicional */}
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">✨ Importante:</span> Recibirás un correo de confirmación con los detalles de tu pedido.
                    </p>
                </div>

                {/* Contador */}
                <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FiLoader className="animate-spin" />
                    <p className="text-sm">
                        Redirigiendo a tus compras en <span className="font-bold text-primary-600">{countdown}</span> segundos...
                    </p>
                </div>

                {/* Botón manual */}
                <button
                    onClick={() => navigate(SUCCESS_URL, { replace: true })} 
                    className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors cursor-pointer"
                >
                    Ver mis compras ahora
                </button>
            </div>
        </div>
    );
};

export default CheckoutSuccess;