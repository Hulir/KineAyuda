// src/services/authService.ts
import api from "./api";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../firebaseConfig"; // 👈 importante: subir un nivel

const auth = getAuth(app);

// 🔐 Login con Firebase y validación con backend Django
export async function loginKinesiologo(email: string, password: string) {
  try {
    // 1) Login en Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    // 2) Verificar token en el backend
    const response = await api.post("/login/verify", { token });
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);

    return {
      firebaseUser: userCredential.user,
      backendData: response.data,
    };
  } catch (error: any) {
    // 👉 Aquí capturamos bien el mensaje del backend
    console.error("Error en loginKinesiologo:", error.response?.data || error);

    const backendMsg = error.response?.data?.error; // viene de la vista verificar_firebase_token
    const firebaseCode = error.code; // ej: auth/wrong-password
    const generic = error.message;

    // Elegimos el mensaje más útil
    const finalMsg = backendMsg || firebaseCode || generic || "Error desconocido al iniciar sesión.";
    throw new Error(finalMsg);
  }
}

// 🚪 Cerrar sesión
export async function logoutKinesiologo() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    localStorage.clear();
  }
}

// 👤 Usuario actual
export function obtenerUsuarioActual() {
  return auth.currentUser;
}
