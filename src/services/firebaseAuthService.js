
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc  } from "firebase/firestore";

// Функція входу
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Функція реєстрації
export const signup = async (userData) => {
  const { email, password, firstName, lastName, birthDate, gender } = userData;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    firstName,
    lastName,
    birthDate,
    gender,
    email,
    createdAt: new Date(), // Дата реєстрації
    lastLogin: new Date(), // Час останнього входу
  });

  return user;
};

// Функція для оновлення часу останнього входу
export const updateLastLogin = async (uid) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    lastLogin: new Date() // Оновлюємо час останнього входу
  });
};
