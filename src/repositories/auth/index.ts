import { auth, db } from '@/configs/firebase';
import { BARNABAS_COLLCTION, TBarnabasProfile } from '@/types/barnabas.types';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export async function signUpUser({
  email,
  password,
  barnabasId,
}: {
  email: string;
  password: string;
  barnabasId: string;
}) {
  try {
    // Firebase Authentication을 이용한 회원가입
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const barnabasRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.BARNABAPROFILE,
      barnabasId
    );

    // Firestore에 사용자 정보 저장
    await updateDoc(barnabasRef, {
      uid: user.uid,
      email,
    });

    const barnabasDoc = await getDoc(barnabasRef);

    if (!barnabasDoc.exists()) {
      console.warn(
        `⚠️ Firestore에 ${barnabasId}에 해당하는 데이터가 없습니다.`
      );
      return { user, profile: null };
    }

    return { user, profile: barnabasDoc.data() as TBarnabasProfile };
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
}

export async function signInUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    // Firebase Authentication을 이용한 회원가입
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Firestore에서 BarnabasUser 정보 가져오기
    const barnabasRef = collection(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.BARNABAPROFILE
    );

    const q = query(barnabasRef, where('uid', '==', user.uid));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { user, profile: null };
    } else {
      const firstBarnabas = querySnapshot.docs[0].data();

      return { user, profile: firstBarnabas as TBarnabasProfile };
    }
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
}

export async function getMe(uid: string) {
  try {
    // Firestore에서 BarnabasUser 정보 가져오기
    const barnabasRef = collection(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.BARNABAPROFILE
    );

    const q = query(barnabasRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`프로필 정보가 없습니다: ${uid}`);
      return null;
    }

    return querySnapshot.docs[0].data() as TBarnabasProfile;
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // 리스너 해제
        resolve(user);
      },
      reject
    );
  });
}
