import InfoForm from './InfoForm';
import EmailSlide from './EmailSlide';
import UsernameSlide from './UsernameSlide';
import PasswordSlide from './PasswordSlide';
import ProfileView from './ProfileView';
import LanguageSelector from './LanguageSelector';
import BookInserter from './BookInserter';

const googleApi = 'https://www.googleapis.com/books/v1/volumes?q=';

function uploadProfileImage(image, callback) {
  const upload = new Slingshot.Upload('profileImageUpload');

  upload.send(image, (error, downloadUrl) => {
    if (error) {
      callback(error);
    } else {
      callback(error, downloadUrl);
    }
  });
}

const introSlides = [
  {
    title: 'Virtualise your library',
    subtitle:
      'Put up your books to see and plan what to read. let others see what you have',
    color: 'info'
  },
  {
    title: 'Inspire and Discover Books',
    subtitle:
      'Get to see the books people have in short distance to you and borrow. Discover new books',
    color: 'primary'
  },
  {
    title: 'Let People Read More',
    subtitle:
      'Get borrow requests from interesting readers in your city, become a librarian',
    color: 'success'
  }
];

export {
  InfoForm,
  EmailSlide,
  UsernameSlide,
  PasswordSlide,
  ProfileView,
  LanguageSelector,
  BookInserter,
  introSlides,
  uploadProfileImage,
  googleApi
};
