import FireBaseKeys from "./config"
import firebase from 'firebase'

class Fire{
    constructor() {
        firebase.initializeApp(FireBaseKeys); //find out why a problem is coming because of this.
    }

    addPost = async ({text, localUri}) => {
        const remoteUri = await this.uploadPhotoAsync(localUri);

        return new Promise((res, rej) => {
            this.firestore
                .collection("posts")
                .add({
                    text,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    addUserDocument= async() => {
        return new Promise((res, rej) => {
            var temp_id = this.uid;
            console.log(temp_id)
            var map1 = {}
            this.firestore
                .collection("raydius_firebase_profiles").doc(temp_id)
                .set({
                    saved_posts: map1,
                    own_posts: map1
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    }

    addMarkerPost = async ({title, description, category, website_link, coordinates, start_date, end_date, localUri}) => {
        const remoteUri = localUri==="no image" ? "no image" : (await this.uploadPhotoAsync(localUri));

        return new Promise((res, rej) => {
            this.firestore
                .collection("raydius_firebase_markers")
                .add({
                    title,
                    description,
                    category,
                    start_date,
                    end_date,
                    website_link,
                    publisher_uid: this.uid,
                    timestamp: this.timestamp,
                    image_ref: remoteUri,
                    coordinates: coordinates
                })
                .then(ref => {
                    this.addOwnPostToMap(ref.id);
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    addOwnPostToMap= async id => {
        return new Promise((res, rej) => {
            var temp_id = this.uid
            var map = {}
            map[id]=''
            this.firestore
                .collection("raydius_firebase_profiles").doc(temp_id)
                .set({own_posts:map}, {merge:true})
                .then(ref => {
                    console.log(ref)
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    }

    deleteOwnPostFromMap = async post_id => {
        return new Promise((res, rej) => {
            var temp_id = this.uid 
            this.firestore
                .collection("raydius_firebase_profiles").doc(temp_id)
                .set({own_posts:{
                    [post_id] : firebase.firestore.FieldValue.delete()
                }},{merge:true})
                .then(ref => {
                    console.log(ref)
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });       
    }

    deleteOwnPostMarker = async post_id => {
        return new Promise((res, rej) => {
            this.firestore
                .collection("raydius_firebase_markers").doc(post_id).delete()
                .then(ref => {
                    console.log(ref)
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });       
    }

    saveMarkerPost = async id => {
        return new Promise((res, rej) => {
            var temp_id = this.uid;
            var map = {};
            map[id] = '';
            this.firestore
                .collection("raydius_firebase_profiles").doc(temp_id)
                .set({saved_posts: map}, {merge: true})
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    deleteSavedPostFromMap = async post_id => {
        return new Promise((res, rej) => {
            var temp_id = this.uid 
            this.firestore
                .collection("raydius_firebase_profiles").doc(temp_id)
                .set({saved_posts:{
                    [post_id] : firebase.firestore.FieldValue.delete()
                }},{merge:true})
                .then(ref => {
                    console.log(ref)
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });       
    }
    
    uploadPhotoAsync = async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                    .storage()
                    .ref(path)
                    .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    get firestore() {
        return firebase.firestore();
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;