import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";

/**
 * Bu bileşen, altındaki rotaları sarmalayarak koruma altına alır.
 * Kullanıcı giriş yapmamışsa veya 'admin' rolüne sahip değilse,
 * onu giriş sayfasına yönlendirir.
 */
const ProtectedRoute = () => {
  const user = getCurrentUser(); // localStorage'dan kullanıcı bilgilerini al

  // Kullanıcı var mı, token'ı var mı ve rolü 'admin' mi diye kontrol et
  if (user && user.token && user.role === "admin") {
    // Eğer tüm koşullar sağlanıyorsa, altındaki rotanın (örneğin AdminLayout)
    // render edilmesine izin ver. <Outlet /> bunu temsil eder.
    return <Outlet />;
  } else {
    // Eğer koşullar sağlanmıyorsa, kullanıcıyı login sayfasına yönlendir.
    // `replace` prop'u, tarayıcı geçmişinde bu yönlendirmenin bir iz bırakmamasını sağlar,
    // böylece kullanıcı geri tuşuna basarak korunan sayfaya dönemez.
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedRoute;
