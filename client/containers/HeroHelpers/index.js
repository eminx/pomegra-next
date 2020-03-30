import InfoForm from './InfoForm';
import EmailSlide from './EmailSlide';
import UsernameSlde from './UsernameSlide';
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
      'get to see the books people have in short distance to you, and borrow',
    color: 'info'
  },
  {
    title: 'Inspire and Discover Books',
    subtitle:
      'get to see the books people have in short distance to you, and borrow',
    color: 'primary'
  },
  {
    title: 'Let People Read More',
    subtitle:
      'get borrow requests from interesting readers in your city, become a librarian',
    color: 'success'
  }
];

export {
  InfoForm,
  EmailSlide,
  UsernameSlde,
  PasswordSlide,
  ProfileView,
  LanguageSelector,
  BookInserter,
  introSlides,
  uploadProfileImage,
  googleApi
};
