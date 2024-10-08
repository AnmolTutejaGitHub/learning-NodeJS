const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject("numbers must be non -ve");
            }
            resolve(a + b);
        }, 2000)
    })
}

// add(1, 2).then((sum) => {
//     console.log(sum);

//     add(sum, 5).then((sum2) => {
//         console.log(sum2);
//     }).catch((e) => {
//         console.log(e);
//     })
// }).catch((e) => {
//     console.log(e);
// })

add(1, 1).then((sum) => {
    console.log(sum);
    return add(sum, -44); //returning new promise fromt his then
}).then((sum2) => {
    console.log(sum2);
}).catch((e) => {
    console.log(e);
})


const doWork = async () => {
    const sum = await add(1, 2);
    const sum2 = await add(sum, 3);
    return sum2;
}

doWork().then((res) => {
    console.log(res);
})
