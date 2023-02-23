const make_tables = () => {
    const expiration = Date.now() + (5 * 60 * 1000); // 5 minutes from now

    tables = JSON.parse(localStorage.getItem('tables'));
    const tables_expiration = localStorage.getItem('tables_expiration');

    if (tables && tables_expiration && Date.now() < tables_expiration) {
        console.log('tables : localStorage에서 가져옴.', tables);
    } else {

        get_category_user().then(tables => {
            console.log('tables: 서버에서 가져옴.', tables);
            localStorage.setItem('tables', JSON.stringify(tables));
            localStorage.setItem('tables_expiration', expiration);
        });
    }
};

const get_category_user = () => {
    return new Promise((resolve, reject) => {
        const tables = {};

        Promise.all([
            axios.get('/category_db/category_table')
                .then(res => {
                    console.log("res.data : ", res.data);
                    tables['category_table'] = res.data;
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                }),

            axios.get('/auth/user_table')
                .then(res => {
                    console.log("res.data : ", res.data);
                    tables['user_table'] = res.data;
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                })
        ]).then(() => {
            resolve(tables);
        });
    });
};



