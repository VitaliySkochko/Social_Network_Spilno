
import { auth, db } from "./firebase"; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc  } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Функція входу
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Отримання токену користувача з Firestore
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.data();

  // Оновлення часу останнього входу
  await updateLastLogin(user.uid);

  return { user, token: userData.token }; // Повертаємо токен разом з користувачем
};

// Функція реєстрації
export const signup = async (userData) => {
  const { email, password, firstName, lastName, birthDate, gender } = userData;

  // Створення користувача в Firebase
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Генерація унікального токену
  const token = uuidv4();

  // Збереження користувача в Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    firstName,
    lastName,
    birthDate,
    gender,
    email,
    token, // Додавання токену
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
