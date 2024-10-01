// this is asynchonous code
setTimeout(() => {
    console.log("hello");
}, 2000);

setTimeout(() => {
    console.log("0 second timer"); //why 0 second timer is after Hey
}, 0);

console.log("Hey");


// Hey
// 0 second timer
// hello