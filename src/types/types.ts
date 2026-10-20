
export interface User {
    id: number,
    name: string,
    loginMail: string,
    statusAdmin: boolean, //свойство статус определяет права пользователя (админ или пользователь)
    password: string,
    passwordConfirm: string,
    salt: string,
    register: boolean, //необходимость регистрации
    dateReg: string
}
export interface Genre {
    id: number,
    name: string
}

export interface Song {
    id: number,
    name: string,
    author: string,
    path: string,
    genreId: number,
    genre: string
}

