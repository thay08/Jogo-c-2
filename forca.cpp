#include <iostream>
#include <vector>
#include <string>
#include <cstdlib>
#include <ctime>

using namespace std;

// Funções para o jogo
void limpaTela() {
    system("CLS"); // Ou "clear" no Linux
}

string retornaPalavraAleatoria() {
    vector<string> palavras = {"pizza", "sushi", "hamburguer", "feijoada", "tacacá"};
    return palavras[rand() % palavras.size()];
}

string retornaPalavraComMascara(const string& palavra) {
    return string(palavra.length(), '_');
}

void exibeStatus(const string& palavraComMascara, int tentativasRestantes, const string& letrasJaArriscadas) {
    cout << "\nPalavra: " << palavraComMascara;
    cout << "\nTentativas Restantes: " << tentativasRestantes;
    cout << "\nLetras arriscadas: " << letrasJaArriscadas;
}

void exibirBoneco(int erros) {
    cout << "  -----  \n";
    cout << "  |   " << (erros > 0 ? "O" : " ") << "  \n";
    cout << "  |  " << (erros > 2 ? "/" : " ") << (erros > 1 ? "|" : " ") << (erros > 3 ? "\\" : " ") << "\n";
    cout << "  |  " << (erros > 4 ? "/" : " ") << " " << (erros > 5 ? "\\" : " ") << "\n";
    cout << "  | \n";
    cout << "========\n";
}

int jogar() {
    string palavra = retornaPalavraAleatoria();
    string palavraComMascara = retornaPalavraComMascara(palavra);
    int tentativas = 0, maximoDeTentativas = 6;
    string letrasJaArriscadas;

    while (palavra != palavraComMascara && tentativas < maximoDeTentativas) {
        limpaTela();
        exibirBoneco(tentativas);
        exibeStatus(palavraComMascara, maximoDeTentativas - tentativas, letrasJaArriscadas);

        char letra;
        cout << "\nDigite uma letra: ";
        cin >> letra;

        if (letrasJaArriscadas.find(tolower(letra)) == string::npos) {
            letrasJaArriscadas += tolower(letra);
            bool acertou = false;

            for (size_t i = 0; i < palavra.length(); ++i) {
                if (palavra[i] == tolower(letra)) {
                    palavraComMascara[i] = palavra[i];
                    acertou = true;
                }
            }

            if (!acertou) {
                tentativas++;
            }
        } else {
            cout << "Essa letra já foi digitada!\n";
        }
    }

    limpaTela();
    if (palavra == palavraComMascara) {
        cout << "Parabéns, você venceu! A palavra era: " << palavra << endl;
    } else {
        cout << "Que pena! Você perdeu! A palavra era: " << palavra << endl;
    }
    
    return 0; // Para reiniciar o jogo, você pode usar um loop aqui.
}

int main() {
    srand(static_cast<unsigned>(time(0)));
    jogar();
    return 0;
}

