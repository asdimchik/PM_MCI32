angular.module('starter.controllers', ['ngCordova'])

    .controller('ListCtrl', function ($scope, $ionicPlatform, $timeout, $state, NotesDataService, $cordovaFile, $ionicPopup, ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function (e) {
            NotesDataService.getAll(function (data) {
                $scope.disabledButton = false;
                $scope.itemsList = data
                if(data.length == 0){
                    $scope.disabledButton = true;
                }
            })
        })

        $scope.gotoEdit = function (idNote) {
            $state.go('form', {id: idNote})
        }

        $scope.sendContacts = function () {
            $ionicPlatform.ready(function () {
                NotesDataService.getContactsForCSV(function (data) {
                    ContactsService.createFile(data);
                })
                ContactsService.createEmail()
            })
        }

        $scope.deleteAllContacts = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Supprimer toutes les contacts',
                template: 'êtes vous sûr de vouloir supprimer ?'
            });
            // to activate ink on modal
            $timeout(function() {
                ionicMaterialInk.displayEffect();
            }, 0);

            confirmPopup.then(function (res) {
                if (res) {
                    NotesDataService.deleteAllNotes().then($state.reload('list'))
                    $scope.disabledButton = true;
                }
            })
        }
    })

    .controller('FormCtrl', function ($scope, $stateParams, $ionicPopup, $state, NotesDataService, PopupService) {
        $scope.$on('$ionicView.enter', function (e) {

             initForm();
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
                    divers: '',
                    manifest: ''
                };
                NotesDataService.getManifest(function (data) {
                    $scope.noteForm.manifest = data[0].manifest;
                })
            }
        }

        function onSaveSuccess() {
            // $state.go('slider')
            PopupService.popUp()
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
                $scope.formManifest = NotesDataService.getManifest(function (data) {
                    $scope.currentManifest = data[0].manifest;
                });
                 NotesDataService.getAll(function (data) {
                     $scope.numberOfContacts = data.length
                })

            })
        })
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
                        onInit: function (swiper) {
                            $scope.swiper = swiper;
                        }
                    }
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
            })
        })
    })

    .controller('ParamsManifestCtrl', function ($scope, $state, $stateParams, $ionicPlatform, NotesDataService, $cordovaFile, ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {
                $scope.formManifest = NotesDataService.getManifest(function (data) {
                    $scope.formManifest.text = data[0].manifest;
                });

                $scope.formManifest = {text: ''};

                $scope.addManifest = function () {
                    NotesDataService.createManifest($scope.formManifest.text);
                    console.log($scope.formManifest.text);
                    $state.go('reglages');

                }
            })
        })
    })

