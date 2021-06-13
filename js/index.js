// 11 books
// 10 users

document.addEventListener("DOMContentLoaded", function() {

    const listPanel = document.querySelector("#list-panel");
    const list = document.querySelector("#list");
    const showPanel = document.querySelector("#show-panel");

    function getBooks() {
        fetch("http://localhost:3000/books")
        .then(resp => resp.json())
        .then(books => renderBooks(books))
    }

    getBooks();

    function renderBooks(books) {
        list.innerHTML = "";
        books.forEach(book => {
            const li = document.createElement("li");
            li.innerHTML = `<li data-id="book" id="${book.id}">
            ${book.title}</li>`
            list.innerHTML += li.innerHTML;
        })

        list.addEventListener("click", event => {
            if (event.target.dataset.id === "book") {
                const id = parseInt(event.target.id);
                getBook(id);
            }
        })
    }

    function getBook(id) {
        fetch(`http://localhost:3000/books/${id}`)
        .then(resp => resp.json())
        .then(book => renderBook(book))        
    }

    function renderBook(book) {
        showPanel.innerHTML = "";
        const span = document.createElement("span");
        span.innerHTML = `<img src=${book.img_url} alt="book image">
        <h2 id=${book.id}>${book.title}</h2>
        <h2>${book.subtitle}</h2>
        <h2>${book.author}</h2>
        <p>${book.description}</p>
        `
        const ul = document.createElement("ul");
        ul.id = "users";
        book.users.forEach(user => {
            const li = document.createElement("li");
            li.innerHTML = `<li data-id="user" id=${user.id}>
            ${user.username}</li>`
            ul.appendChild(li);
        })
        const button = document.createElement("button");
        button.innerText = "LIKE";
        button.dataset.id = "liked";
        showPanel.append(span);
        span.append(ul);
        ul.append(button);
    }

    showPanel.addEventListener("click", event => {
        if (event.target.innerText === "LIKE") {
            event.target.innerText = "LIKED"
            alert("You have liked this book!")
            getBookToLike(parseInt(event.target.parentElement.parentElement.querySelector("h2").id));
        }
        else {
            event.target.innerText = "LIKE"
            alert("You no longer like this book. If you change your mind, you can always like it again!")
            getBookToDeleteLike(parseInt(event.target.parentElement.parentElement.querySelector("h2").id));
        }
    })

    function getBookToLike(id) {
        fetch(`http://localhost:3000/books/${id}`)
        .then(resp => resp.json())
        .then(book => updateLikes(book))        
    } 

    function getBookToDeleteLike(id) {
        fetch(`http://localhost:3000/books/${id}`)
        .then(resp => resp.json())
        .then(book => deleteLike(book))        
    } 

    function updateLikes(book) {
        const userLikes = book.users.map(user => {
            return {id: user.id, username: user.username}
        })

        userLikes.push({"id": 1, "username": "pouros"})

        const params = {
            "users": userLikes
        }
        const options = {
            method: "PATCH",
            body: JSON.stringify(params)
        }

        fetch(`http://localhost:3000/books/${book.id}`, options)
        .then(resp => resp.json())
    }

    function deleteLike(book) {
        const userLikes = book.users.map(user => {
            return {id: user.id, username: user.username}
        })

        const elementToRemove = {id: 1, username: "pouros"}
        
        function arrayRemove(array, ele) {
            return array.filter(element => {
                return element != ele;
            })
        }

        const result = arrayRemove(userLikes, elementToRemove);
        // debugger;
        // filter didn't work so then I tried to find the index of
        // and that didn't work either
        // result[0]
        // {id: 2, username: "auer"}
        // result.indexOf({id: 2, username: "auer"})
        // -1

        const params = {
            "users": result 
        }
        const options = {
            method: "PATCH",
            body: JSON.stringify(params)
        }

        fetch(`http://localhost:3000/books/${book.id}`, options)
        .then(resp => resp.json())
    }

});
