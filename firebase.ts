import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLLVgClxmt6AIa4poKXLsUH0w8BMLHDHo",
    authDomain: "mohammed-project1-86537.firebaseapp.com",
    projectId: "mohammed-project1-86537",
    storageBucket: "mohammed-project1-86537.firebasestorage.app",
    messagingSenderId: "763638328916",
    appId: "1:763638328916:web:ac1934b3d8cddd5d9d07c1",
    measurementId: "G-TCDB56B8SQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// اختبار الاتصال بـ Firebase عند التحميل
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

// اختبار بسيط للاتصال والقراءة
const testFirebaseConnection = async () => {
  try {
    console.log('🔥 اختبار الاتصال بـ Firebase...');
    
    // محاولة إنشاء document اختبار
    await setDoc(doc(db, 'test', 'connection'), {
      timestamp: new Date(),
      test: true
    });
    console.log('✅ الكتابة إلى Firebase نجحت!');
    
    // محاولة قراءة التعليقات
    const commentsRef = collection(db, 'teacherComments');
    const snapshot = await getDocs(commentsRef);
    console.log('📊 عدد التعليقات في Firebase:', snapshot.size);
    
    if (snapshot.size > 0) {
      console.log('📝 التعليقات الموجودة:');
      snapshot.forEach(doc => {
        console.log('  -', doc.id, ':', doc.data());
      });
    } else {
      console.log('⚠️ لا توجد تعليقات في Firebase بعد');
    }
    
    console.log('✅ Firebase متصل بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في الاتصال بـ Firebase:', error);
  }
};

// تشغيل الاختبار
if (typeof window !== 'undefined') {
  testFirebaseConnection();
}
