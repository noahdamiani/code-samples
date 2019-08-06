import men from "./mock/men"
import women from "./mock/women"
import words from "./mock/words"

class UserGenerator {
    // Generate a list with a provided number of users
    generate = (numberOfUsers) => [...new Array(numberOfUsers)].map(() => this.user())

    // Generate a single user
    user() {
        const gender = this.randomGender()
        const name = this.firstName(gender)
        const username = this.username(name)
        const userImg = this.img(gender)
        
        return {
            name,
            username,
            userImg,
            subscribed: false
        }
    }

    // "Coin flip" for Male or Female
    randomGender = () => Math.floor(Math.random() * 2) === 0 ? "male" : "female"

    // Generates a random user image
    img(gender) {
        // Select from portrait images based on provided gender
        const selectGender = gender === "male" ? "men" : "women"
    
        // Random portrait API endpoint
        const portrait = 'https://randomuser.me/api/portraits'
    
        // Grabs a random portrait, from 1 to 100
        const randomNumber = Math.floor(Math.random() * 100)
    
        return `${portrait}/${selectGender}/${randomNumber}.jpg`
    }


    firstName(gender) {
        let randomMax, names

        // Random male name
        if (gender === "male") {
            randomMax = men.length
            names = men
        } else {
            // Random female name
            randomMax = women.length
            names = women
        }

        return names[Math.floor(Math.random() * randomMax)]
    }
    
    capitalize = (string) =>  string.charAt(0).toUpperCase() + string.slice(1)

    // Generates a random username from a first name and list of words
    username(firstName) {
        const randomMax = words.length
        const randomNumber = Math.floor(Math.random() * randomMax)
        const randomWord = words[randomNumber]
        return `${firstName}${this.capitalize(randomWord)}${randomNumber}`
    }
}

export default UserGenerator
