// Exemple de composant React avec plusieurs problèmes de qualité
// Approche par classe obsolète dans React. Il faut utiliser les hooks et les composants fonctionnels et les pure components.
// L'extension de fichier devrait être .jsx
// Pas de commentaires sur les fonctions

class productList extends React.Component {
  // Mauvaise convention de nommage (devrait être PascalCase)
    
  constructor(props) {
    super(props);
    this.state = {
      products: [], // Pas de typage
      loading: false,
      error: null,
      selectedProduct: null,
      filteredProducts: [], // État dérivé qui devrait être calculé
      sortOrder: 'asc',
      categoryFilter: 'all',
      searchQuery: '',
      page: 1
    };
  }

  // Méthode trop longue faisant trop de choses
  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const response = await fetch('http://api.example.com/products');
      const data = await response.json();
      this.setState({ 
        products: data,
        filteredProducts: this.filterAndSortProducts(data)
      });
    } catch (e) {
      console.log('Error:', e); // Mauvaise gestion d'erreur
      this.setState({ error: 'Failed to load products' });
    } finally {
        this.setState({ loading: false });
    }
  }

  // Logique métier qui devrait être externalisée
  filterAndSortProducts(products) {
    let result = [...products];
    
    if (this.state.categoryFilter !== 'all') {
      result = result.filter(p => p.category === this.state.categoryFilter);
    }
    
    if (this.state.searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
      );
    }
    
    result.sort((a, b) => {
      if (this.state.sortOrder === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    
    return result;
  }

  // Event handlers non optimisés
  handleSearch = (e) => {
    const query = e.target.value;
    this.setState({ 
      searchQuery: query,
      filteredProducts: this.filterAndSortProducts(this.state.products)
    });
  }

  render() {
    if (this.state.loading) return <div>Loading...</div>;
    if (this.state.error) return <div>{this.state.error}</div>;

    return (
      <div className='product-list-container'>
        <input 
          type="text" 
          onChange={this.handleSearch}
          value={this.state.searchQuery}
        />
        {/* Rendu non optimisé */}
        {this.state.filteredProducts.map((product, i) => (
          <div key={i}> {/* Mauvaise pratique pour la key */}
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button onClick={() => this.setState({ selectedProduct: product })}>
              View Details
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default productList; 