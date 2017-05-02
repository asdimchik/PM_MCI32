angular.module('starter.controllers', ['ngCordova'])

    .controller('ListCtrl', function ($scope, $ionicPlatform, $state, NotesDataService) {
        $scope.$on('$ionicView.enter', function (e) {
            NotesDataService.getAll(function (data) {
                $scope.itemsList = data
            })
        })

        $scope.gotoEdit = function (idNote) {
            $state.go('form', {id: idNote})
        }
    })

    .controller('FormCtrl', function ($scope, $stateParams, $ionicPopup, $state, NotesDataService) {
        $scope.$on('$ionicView.enter', function (e) {
            initForm()
        })

        function initForm() {
            if ($stateParams.id) {
                NotesDataService.getById($stateParams.id, function (item) {
                    $scope.noteForm = item
                })
            } else {
                $scope.noteForm = {
                    nom: '',
                    prenom: '',
                    codePostale: '',
                    ville: '',
                    email: '',
                    portable: '',
                    divers: ''
                };
            }
        }

        function onSaveSuccess() {
            $state.go('slider')
        }

        $scope.saveNote = function () {

            if (!$scope.noteForm.id) {
                NotesDataService.createNote($scope.noteForm).then(onSaveSuccess)
            } else {
                NotesDataService.updateNote($scope.noteForm).then(onSaveSuccess)
            }
        }

        $scope.confirmDelete = function (idNote) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Supprimer une note',
                template: 'êtes vous sûr de vouloir supprimer ?'
            })

            confirmPopup.then(function (res) {
                if (res) {
                    NotesDataService.deleteNote(idNote).then(onSaveSuccess)
                }
            })
        }
    })

    .controller('ReglagesCtrl', function ($scope, $state, NotesDataService, $cordovaFile, $ionicPlatform, ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {
                $scope.formEmail = NotesDataService.getEmail(function (data) {
                    $scope.currentEmail = data[0].email;
                });
            })
        })
        //
        // $scope.crAndSaveCSV = function () {
        //   NotesDataService.getAll(function (data) {
        //     ContactsService.createFile(data);
        //   });
        // }
        //
        // $scope.sendEmail = function () {
        //   ContactsService.createEmail()
        // }
        //
        // $scope.getImageSaveContact = function () {
        //   ImagesManagerService.getImages(function (data) {
        //     $scope.imgList = data;
        //   });
        // }
        ionicMaterialInk.displayEffect();
    })

    .controller('AddImagesCtrl', function ($scope, $cordovaDevice, $stateParams, $cordovaImagePicker, $cordovaFile, $ionicPlatform, AddImageFromPicker, FileService) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {
                $scope.images = FileService.images();
                $scope.$apply();
            });
            $scope.addFromPicker = function () {
                AddImageFromPicker.saveMediaPicker();
            }
            $scope.deleteAllImages = function () {
                window.localStorage.clear();
                $scope.images = FileService.images();
                $scope.$apply();
            }
        })
    })

    .controller('SliderCtrl', function ($scope, $cordovaDevice, $stateParams, $state, $ionicPlatform, $cordovaImagePicker, AddImageFromPicker, FileService, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {

                var images = FileService.images();
                $scope.numberOfSlides = images.length;
                $scope.images = images;
                $scope.lastImg = images[images.length-1];
                $scope.$apply();
                $scope.sliderOptions = {
                    loop: false,
                    pagination: true,
                    initialSlide: 0,
                    onInit: function (swiper) {
                        $scope.swiper = swiper;
                    }
                }

                /////// slider swiper///////
                // var mySwiper = new Swiper('.swiper-container', {
                //   initialSlide: 0,
                //   direction: 'horizontal', //or vertical
                //   speed: 400, //0.4s transition
                //   spaceBetween: 0,
                //     preloadImages: false,
                //     lazyLoading: true,
                //
                // });
                // mySwiper;
                //////// end slider swiper//////

                ////////slider 2////////
                // var setupSlider = function () {
                //     //some options to pass to our slider
                //     $scope.sliderOptions = {
                //         initialSlide: 0,
                //         direction: 'horizontal', //or vertical
                //         speed: 400, //0.3s transition
                //         pagination: false
                //     };
                //     $scope.$apply();
                // };
                // setupSlider();
                // $scope.sliderOptions = {
                //     effect: 'slide',
                //     paginationHide: true,
                //     initialSlide: 0,
                //     speed: 100,
                //     onInit: function(swiper){
                //         $scope.swiper = swiper;
                //     }
                // }
            })
        })
    })

    .controller('ParamsEmailCtrl', function ($scope, $state, $stateParams, $ionicPlatform, NotesDataService, $cordovaFile, ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {
                $scope.formEmail = NotesDataService.getEmail(function (data) {
                    $scope.formEmail.address = data[0].email;
                });

                $scope.formEmail = {address: ''};

                $scope.addEmail = function () {
                    NotesDataService.createEmail($scope.formEmail.address);
                    $state.go('reglages');

                }







                $scope.sendContacts = function () {

                    var address = $scope.formEmail.address;
                    var manifest = $scope.formEmail.manifest;

                    if (!address) {
                        alert('Saisissez une adresse email valide');
                    } else {
                        NotesDataService.getAll(function (data) {
                            ContactsService.createFile(data);
                        });
                        ContactsService.createEmail(address, manifest)
                        $state.go('reglages');
                    }
                }
            })
        })
    })

