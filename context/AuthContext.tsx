import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UserData {
  photoURL: any;
  name?: string;
  phone?: string;
  email?: string;
}

interface AuthContextType {
  firebaseUser: any;
  userData: UserData | null;
  signup: (email: string, password: string, extraData?: Partial<UserData>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserData(snap.data() as UserData);
        } else {
          setUserData({ name: user.displayName || "", email: user.email || "" });
        }
      } else {
        setUserData(null);
      }
    });
    return unsubscribe;
  }, []);

  // 🔹 SIGNUP
  const signup = async (email: string, password: string, extraData: Partial<UserData> = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const ref = doc(db, "users", cred.user.uid);
    const data: UserData = { email, ...extraData };
    await setDoc(ref, data);
    setUserData(data);
  };

  // 🔹 LOGIN
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🔹 LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  // 🔹 UPDATE PROFILE
  const updateUserData = async (data: Partial<UserData>) => {
    if (!firebaseUser) throw new Error("No logged in user");
    const ref = doc(db, "users", firebaseUser.uid);
    const newData = { ...userData, ...data };
    await setDoc(ref, newData, { merge: true });
    setUserData(newData);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, userData, signup, login, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
