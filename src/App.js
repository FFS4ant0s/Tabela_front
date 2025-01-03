import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {

  // Objeto produto
  const produto = {
    codigo: 0,
    nome: '',
    marca: ''
  }

  // UseState
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto);

  // Useffect
  useEffect(() => {
    fetch("http://localhost:8080/listar")
      .then(retorno => retorno.json())
      .then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  // Obtendo os dados do formulário
  const aoDigitar = (e) => {
    setObjProduto({ ...objProduto, [e.target.name]: e.target.value });
  }

  // Cadastrar produto
  const cadastrar = () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!objProduto.nome || !objProduto.marca) {
      alert('Por favor, preencha todos os campos!');
      return; // Não faz a requisição se algum campo estiver vazio
    }

    fetch('http://localhost:8080/cadastrar', {
      method: 'POST',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then((retorno) => retorno.json())
      .then((retorno_convertido) => {
        // Verifica se a resposta contém uma mensagem de erro
        if (retorno_convertido.mensagem) {
          alert(retorno_convertido.mensagem);
        } else {
          setProdutos((prevProdutos) => [...prevProdutos, retorno_convertido]);
          alert('Produto cadastrado com sucesso!');
          limparFormulario()
        }
      })
      .catch((error) => {
        console.error('Erro ao cadastrar produto:', error);
        alert('Houve um erro ao cadastrar o produto.');
      });
  };

  // Alterar produto
  const alterar = () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!objProduto.nome || !objProduto.marca) {
      alert('Por favor, preencha todos os campos!');
      return; // Não faz a requisição se algum campo estiver vazio
    }

    fetch('http://localhost:8080/alterar', {
      method: 'put',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then((retorno) => retorno.json())
      .then((retorno_convertido) => {
        // Verifica se a resposta contém uma mensagem de erro
        if (retorno_convertido.mensagem) {
          alert(retorno_convertido.mensagem);
        } else {
          // Mensagem 
          alert('Produto alterado com sucesso!');


          // Cópia do vetor de produtos
          let vetorTemp = [...produtos];

          // Indice 
          let indice = vetorTemp.findIndex((p) => {
            return p.codigo === objProduto.codigo;
          });

          // Atualizar produto do vetorTemp
          vetorTemp[indice] = objProduto;

          // Atualizar o vegor de produtos
          setProdutos(vetorTemp);

          //Limpar Formulario
          limparFormulario()
        }
      })
      .catch((error) => {
        console.error('Erro ao alterar produto:', error);
        alert('Houve um erro ao alterar o produto.');
      });
  };


  // Remover produto
  const remover = () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!objProduto.nome || !objProduto.marca) {
      alert('Por favor, preencha todos os campos!');
      return; // Não faz a requisição se algum campo estiver vazio
    }

    fetch('http://localhost:8080/remover/' + objProduto.codigo, {
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then((retorno) => retorno.json())
      .then((retorno_convertido) => {

        // Mensagem
        alert(retorno_convertido.mensagem);

        // Cópia do vetor de produtos
        let vetorTemp = [...produtos];

        // Indice 
        let indice = vetorTemp.findIndex((p) => {
          return p.codigo === objProduto.codigo;
        });

        // Remover produto do vetorTemp
        vetorTemp.splice(indice, 1);

        // Atualizar o vegor de produtos
        setProdutos(vetorTemp);

        // Limpar formulário
        limparFormulario();

      })
      .catch((error) => {
        console.error('Erro ao remover produto:', error);
        alert('Houve um erro ao remover o produto.');
      });
  };

  // Limpar formulário
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  // Selecionar produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }


  // Retorno
  return (
    <div>
      <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar} obj={objProduto} remover={remover} alterar={alterar} cancelar={cancelar} />
      <Tabela vetor={produtos} selecionar={selecionarProduto} />
    </div>
  );
}

export default App;
