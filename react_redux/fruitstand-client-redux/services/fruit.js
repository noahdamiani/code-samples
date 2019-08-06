const FruitService = (id, callback) => {
    fetch(`http://localhost:4300/api/inventory/${id}`)
        .then(res => res.json())
        .then(callback);
}

export default FruitService;

