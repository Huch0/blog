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



