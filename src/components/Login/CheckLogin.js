import React from "react";
import axios from "axios";
import { withRouter } from "react-router";
import { cacheAdapterEnhancer } from 'axios-extensions';
import CheckToken from "../../functions/CheckToken";


const instance = axios.create({
    baseURL: '/',
    adapter: cacheAdapterEnhancer(axios.defaults.adapter,
        { enabledByDefault: false }),
})


class CheckLogin extends React.Component {
    checkUser = event => {
        event.preventDefault();

        const email = this.email.value

        const loginInfo = async () => {
            try {
                return instance.get('https://lia1dk4nze.execute-api.ap-northeast-2.amazonaws.com/default/userCheckLogin', {params: { email: email }});
            } catch (error) {
                alert(error.message);
                console.error(error);
            }
        };
        
        const checkLogin = () => {
            loginInfo()
            .then(response => {
                if (response.data.statusCode === 200) {
                    const userInfo = response.data.body[0]

                    const password = this.password.value
                    const userPassword = userInfo.password

                    const bcrypt = require('bcryptjs')
                    const result = bcrypt.compareSync(password, userPassword)

                    if (result === true) {

                        const jwt = require("jsonwebtoken")
                        const SECRET_TOKEN = userInfo.SECRET_TOKEN;
                        const token = jwt.sign({ id: userInfo.id, nickname: userInfo.nickname}, SECRET_TOKEN, {expiresIn: "1d"});
                        const postUserToken = {
                            'id': userInfo.id,
                            'nickname': userInfo.nickname,
                            'token': token
                        }
                        axios.post('https://mupq91eq93.execute-api.ap-northeast-2.amazonaws.com/default/userPostToken', {...postUserToken})
                        .then(resp => {
                            const accessToken = resp.data.body;
                            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                            // 임시로 토큰 유지하기 위해 로컬스토리지에 토큰을 저장함.
                            const bearerToken = 'Bearer ' + accessToken
                            window.localStorage.setItem('Token', bearerToken)

                            CheckToken(bearerToken);
                            alert("Login Success! Welcome to PhillNewsFeed!")

                            this.props.history.push("/")

                            // 임시방편으로...
                            return window.location.reload();
                            

                        }).catch(error => {
                            console.error(error);
                        })

                    } else {
                        alert("The Password is Different")
                        this.email.value = "";
                        this.password.value = "";
                    }
                } else {
                    alert(response.data.errorMessage);
                    this.email.value = "";
                    this.password.value = "";
                }
            })
            .catch(error => {
                alert(error.message);
                console.log(error);
            })
        }

        checkLogin();
    }

    componentWillUnmount(){
    }

    render() {
        return (
            <>
                <div className="login__form">
                    <form onSubmit={this.checkUser}>
                        <input
                            name="email"
                            placeholder="enter your email"
                            required ref={(input) => this.email = input}>
                        </input><br></br>
                        <input
                            name="password"
                            placeholder="enter your password"
                            required ref={(input) => this.password = input}>
                        </input><br></br>
                        <div className="login__action">
                            <button type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </>
        );
    }
}

export default withRouter(CheckLogin);