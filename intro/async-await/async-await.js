const doWork = async () => {
    return 'Anmol';
}

console.log(doWork()); // returns Promise of undefined

doWork().then((res) => {
    console.log(res); // returns Anmol
})
