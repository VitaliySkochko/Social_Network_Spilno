
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
  });

  return user;
};
