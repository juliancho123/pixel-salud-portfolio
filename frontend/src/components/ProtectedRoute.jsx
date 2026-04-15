import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // ¡Importamos TU store!

/*
Este componente es súper flexible. Le podés pasar:
- allowedRoles: Un array de roles que SÍ pueden entrar (ej: ['admin', 'empleado'])
- requiredPermission: Un permiso específico que DEBE tener (ej: 'gestionar_productos')
*/
const ProtectedRoute = ({ allowedRoles }) => {

    const { user } = useAuthStore(); 
    const location = useLocation();


    if (!user) {



        return <Navigate to="/login" state={{ from: location }} replace />;
    }



    if (allowedRoles && !allowedRoles.includes(user.rol)) {

        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;