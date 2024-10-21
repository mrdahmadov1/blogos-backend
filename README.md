# Blogos Backend API - Dokumentasiya

## API Testi üçün Postman Kolleksiyası > [Postman](https://www.postman.com/team-878/workspace/blogos)

API-ni test etmək üçün Postman kolleksiyası hazırlanmışdır.</br>
Bu kolleksiya, bütün mövcud API endpoint-lərini əhatə edir və onları test etmək üçün nümunə sorğular təqdim edir.</br>
Kolleksiyadan istifadə etmək üçün:

1. **Linkə daxil olun**
2. **Postman hesabınıza daxil olun (və ya yeni hesab yaradın)**
3. **Kolleksiyanı öz iş sahənizə əlavə edin**
4. **API-nin host ünvanının və digər lazımi dəyişənlərin təyin olunduğundan əmin olun**
5. **Sorğuları icra edin və yoxlayın**

## Modellər

API iki əsas modeldən ibarətdir:

1. User (İstifadəçi)
2. Post (Məqalə)

İstifadəçilərin iki rolu var: admin və user.

## Routing Strukturu

### Posts Router

```javascript
const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/all', postController.getAllPosts);

router
  .route('/')
  .get(authController.restrictTo('user'), postController.getMyPosts)
  .post(authController.restrictTo('user'), postController.setUserIds, postController.createPost);

router
  .route('/:id')
  .get(postController.getPost)
  .patch(authController.restrictTo('user'), postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
```

### Users Router

```javascript
const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
```

## API Endpoints

### Məqalələr (Posts)

1. **Bütün məqalələri əldə et**: GET `/posts/all`
2. **İstifadəçinin məqalələrini əldə et**: GET `/posts`
3. **Yeni məqalə yarat**: POST `/posts`
4. **Konkret məqaləni əldə et**: GET `/posts/:id`
5. **Məqaləni yenilə**: PATCH `/posts/:id`
6. **Məqaləni sil**: DELETE `/posts/:id`

### İstifadəçilər (Users)

1. **Qeydiyyatdan keç**: POST `/users/signup`
2. **Daxil ol**: POST `/users/login`
3. **Çıxış et**: GET `/users/logout`
4. **Parolu unutdum**: POST `/users/forgotPassword`
5. **Parolu sıfırla**: PATCH `/users/resetPassword/:token`
6. **Parolu yenilə**: PATCH `/users/updateMyPassword`
7. **Öz profilini əldə et**: GET `/users/me`
8. **Profili yenilə**: PATCH `/users/updateMe`
9. **Profili sil**: DELETE `/users/deleteMe`

### Admin Endpoints

1. **Bütün istifadəçiləri əldə et**: GET `/users`
2. **Yeni istifadəçi yarat**: POST `/users`
3. **Konkret istifadəçini əldə et**: GET `/users/:id`
4. **İstifadəçini yenilə**: PATCH `/users/:id`
5. **İstifadəçini sil**: DELETE `/users/:id`

## Təhlükəsizlik

- Bütün routes-lar `authController.protect` middleware-i ilə qorunur.
- Bəzi routes-lar `authController.restrictTo('user')` və ya `authController.restrictTo('admin')` middleware-ləri ilə məhdudlaşdırılıb.

## Əlavə Qeydlər

- API, istifadəçi autentifikasiyası və avtorizasiyası üçün JWT (JSON Web Tokens) istifadə edir.
- Parol unutma və sıfırlama funksionallığı mövcuddur.
- İstifadəçilər öz profillərinə baxa, yeniləyə və silə bilərlər.
- Admin istifadəçilər bütün istifadəçiləri idarə edə bilərlər.
