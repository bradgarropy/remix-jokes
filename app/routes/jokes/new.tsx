const NewJokeRoute = () => {
    return (
        <div>
            <p>Add your own hilarious joke</p>

            <form method="post">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" />
                </div>

                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea name="content" id="content" />
                </div>

                <div>
                    <button type="submit">Add</button>
                </div>
            </form>
        </div>
    )
}

export default NewJokeRoute
