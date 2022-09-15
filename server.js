import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:"1",
        text:"first hello", 
        userId: "2",       
    },

    {
        id:"2",
        text:"2nd hello",  
        userId: "1",             
    }
];

let users = [
    {
        id:"1",
        firstName: "marc",
        lastName: "woo",
    },

    {
        id:"2",
        firstName: "elon",
        lastName: "musk",
    },
];

//schema definition language
const typeDefs = gql`

    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String!
        """
        Is the sum of first and last names
        """
        fullName: String!
    }

    """
    Tweet object represents a resource for a Tweet
    """

    type Tweet {
        id: ID!
        text: String!
        author: User
    }

    type Query {
        allUsers: [User!]!
        allTweets: [Tweet!]!    
        tweet(id: ID!): Tweet 
        ping: String!  
    }

    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        """ Deletes a Tweet if found, else returns false """
        deleteTweet(id: ID!): Boolean!
    }

`;

const resolvers = {
    Query : {
        allTweets() {
            return tweets;
        },

        allUsers() {
            console.log("allUsers called");
            return users;
        },

        tweet(root, {id}) {            
            return tweets.find((tweet) => tweet.id === id);
        },

        ping(){
            return "pong";
        },        
    },

    Mutation : {
        postTweet(_, {text, userId}) {
            const newTweet = {
                id: tweets.length+1,
                text,
            };
            tweets.push(newTweet);
            return newTweet;
        },

        deleteTweet(_, {id}) {
            const tweet = tweets.find((tweet) => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !== id);
            return true;
        },       
        
    },

    User: {
        // firstName({firstName}) {
        //     return firstName;
        // },

        fullName({firstName, lastName}) {            // 헷갈리면 fullName(root) 해보기
            return `${firstName} ${lastName}`;
        }
    },

    Tweet:  {
        author({userId}) {
            return users.find((user) => user.id === userId)
        }
    }
}

const server = new ApolloServer ({typeDefs, resolvers});
server.listen().then(({url}) => {
    console.log(`running on ${url}`);
});
