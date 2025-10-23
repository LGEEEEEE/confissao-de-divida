/**
 * Garante que o objeto jsPDF (da biblioteca jsPDF) esteja disponível 
 * no escopo global (que é como ele é carregado ao usar a tag <script>).
 */
const { jsPDF } = window.jspdf;

/**
 * Função principal para gerar o PDF.
 * Ela será chamada pelo 'onclick' do seu botão no HTML.
 */
function gerarPDF() {

    // --- 1. OBTER VALORES DO HTML ---
    // Pega os valores dos inputs. Se um campo estiver vazio, 
    // usa um placeholder "_____" para manter a aparência do template.

    // Dados do Devedor
    const nome = document.getElementById('nome').value || " ";
    const rg = document.getElementById('rg').value || "_______";
    const cpf = document.getElementById('cpf').value || "_______";
    const endereco = document.getElementById('endereco').value || "_______";
    const orgao = document.getElementById('orgao').value || "_______";

    // Cláusula 1: Operação
    const usou_margem_sim = document.getElementById('usou_margem_sim').checked; // Assumindo um radio/checkbox
    const valor_margem = document.getElementById('valor_margem').value || "_______";
    const banco_quitar = document.getElementById('banco_quitar').value || "_______";
    const valor_parcelas_quitar = document.getElementById('valor_parcelas_quitar').value || "_______";
    const valor_parcelas_unificadas = document.getElementById('valor_parcelas_unificadas').value || "_______";
    const prazo = document.getElementById('prazo').value || "_______";

    // Cláusula 2: Pagamento
    const valor_liquido = document.getElementById('valor_liquido').value || "_______";
    const valor_total_repasse = document.getElementById('valor_total_repasse').value || "_______";

    // Assinaturas
    const testemunha_nome = document.getElementById('testemunha_nome').value || "_______";
    const local_data = document.getElementById('local_data').value || "Brasília/DF, ___ de _________ de _____";

    // --- 2. CONFIGURAÇÃO DO DOCUMENTO ---
    const doc = new jsPDF('p', 'mm', 'a4'); // Retrato, milímetros, A4
    let y = 20;                          // Posição Y (cursor), começando com margem de 20mm
    const x = 15;                        // Margem esquerda fixa de 15mm
    const x_indent = 25;                 // Margem para itens de cláusula (indentados)
    const maxWidth = 180;                // Largura máxima do texto (210mm - 15mm - 15mm)
    const lineHeight = 6;                // Altura da linha (mais apertado para caber tudo)
    const pageHeight = 297;              // Altura da página A4
    const bottomMargin = 20;             // Margem inferior

    // --- 3. FUNÇÕES AUXILIARES (HELPERS) ---

    /**
     * Verifica se o cursor 'y' ultrapassou o limite da página.
     * Se sim, adiciona uma nova página e reseta o 'y'.
     */
    function checkPageBreak() {
        if (y >= pageHeight - bottomMargin) {
            doc.addPage();
            y = 20; // Reseta o 'y' para a margem superior da nova página
        }
    }

    /**
     * Adiciona um parágrafo de texto com quebra de linha automática.
     * @param {string} text - O texto a ser adicionado.
     * @param {boolean} isBold - Se o texto deve ser negrito.
     * @param {boolean} indent - Se o texto deve usar a indentação 'x_indent'.
     */
    function addParagraph(text, isBold = false, indent = false) {
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        
        const current_x = indent ? x_indent : x;
        const current_maxWidth = indent ? maxWidth - (x_indent - x) : maxWidth;

        const lines = doc.splitTextToSize(text, current_maxWidth);
        doc.text(lines, current_x, y);
        y += lines.length * lineHeight; // Incrementa 'y' pelo número de linhas
        checkPageBreak();
    }

    /**
     * Adiciona uma única linha de texto.
     * @param {string} text - O texto a ser adicionado.
     * @param {boolean} isBold - Se o texto deve ser negrito.
     * @param {string} align - 'left', 'center', 'right'.
     * @param {boolean} indent - Se o texto deve usar a indentação 'x_indent'.
     */
    function addLine(text, isBold = false, align = 'left', indent = false) {
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        
        const current_x = indent ? x_indent : x;
        let x_pos = current_x;
        
        if (align === 'center') {
            x_pos = doc.internal.pageSize.getWidth() / 2;
        } else if (align === 'right') {
            x_pos = doc.internal.pageSize.getWidth() - x; // Alinha à margem direita
        }
        
        doc.text(text, x_pos, y, { align: align });
        y += lineHeight;
        checkPageBreak();
    }

    /**
     * Pula um número de linhas.
     * @param {number} count - Número de linhas a pular.
     */
    function skipLines(count = 1) {
        y += lineHeight * count;
        checkPageBreak();
    }

    // --- 4. CONSTRUÇÃO DO PDF (Baseado no seu documento) ---

    // Título
    doc.setFontSize(12);
    addLine('TERMO DE CIÊNCIA, DE RESPONSABILIDADE E CONFISSÃO DE DÍVIDA', true, 'center'); // 
    skipLines(3);

    // Parágrafo de Identificação
    doc.setFontSize(10);
    const p1_text = `Eu, ${nome}, portador da cédula de identidade R.G. nº ${rg} [cite: 2, 3], brasileiro, inscrito no CPF nº ${cpf} [cite: 3], residente e domiciliado na ${endereco} [cite: 3], vinculado ao órgão ${orgao} [cite: 3], DECLARO, para os devidos fins, que autorizo a empresa ALIANÇA CONSIG, inscrita no CNPJ sob o nº 50.113.116/0001-05, com sede na CSE 06, Lote 30, Sala 204 – Taguatinga Sul – CEP: 72025-065 – Brasília/DF, a realizar a quitação dos contratos consignados em meu contracheque, conforme descrito abaixo:A realizar a quitação do(s) contrato(s) de minha responsabilidade que estão consignados em meu holerite de pagamento conforme descrição abaixo: [cite: 4]`;
    addParagraph(p1_text);
    skipLines(2);

    // CLÁUSULA PRIMEIRA
    addLine('CLÁUSULA PRIMEIRA – DA OPERAÇÃO', true); // [cite: 5]
    skipLines(1);
    const margem_sim = usou_margem_sim ? '(X) Sim' : '( ) Sim';
    const margem_nao = !usou_margem_sim ? '(X) Não' : '( ) Não';
    addLine(`1.1. Houve utilização de margem consignável? ${margem_sim}  ${margem_nao}`, false, 'left', true); // [cite: 6]
    if (usou_margem_sim) {
        addLine(`Se sim, qual o valor? R$ ${valor_margem}`, false, 'left', true); // [cite: 6]
    } else {
        addLine(`Se sim, qual o valor? R$ _______`, false, 'left', true); // [cite: 6]
    }
    addLine(`Banco a ser quitado: ${banco_quitar}`, false, 'left', true); // [cite: 7]
    addLine(`Parcelas: R$ ${valor_parcelas_quitar}`, false, 'left', true); // [cite: 8]
    addLine(`Valor final das parcelas unificadas: R$ ${valor_parcelas_unificadas}`, false, 'left', true); // [cite: 9]
    addLine(`Prazo: ${prazo}`, false, 'left', true); // [cite: 10]
    skipLines(2);

    // CLÁUSULA SEGUNDA
    addLine('CLÁUSULA SEGUNDA – DO PAGAMENTO', true); // [cite: 11]
    skipLines(1);
    addLine(`2.1. Valor líquido a ser recebido pelo cliente: R$ ${valor_liquido}, acrescido do estorno da parcela.`, false, 'left', true); // [cite: 12]
    addLine(`2.2. Valor total a ser repassado à empresa, referente à quitação do saldo devedor, comissão, impostos, seguro e juros: R$ ${valor_total_repasse}.`, false, 'left', true); // [cite: 13]
    skipLines(1);
    addParagraph('Parágrafo Único: Autorizo, desde já, que a empresa ALIANÇA CONSIG atue como minha representante para digitação e pagamento das parcelas mencionadas, relativas à compra de dívida perante os bancos citados, com a transferência para o banco Bradesco S.A, observando que os valores podem variar de acordo com os juros e coeficientes do dia, mediante aprovação da operação.'); // [cite: 14]
    skipLines(2);

    // CLÁUSULA TERCEIRA
    addLine('CLÁUSULA TERCEIRA – DA ABERTURA DE CONTAS', true); // [cite: 15]
    skipLines(1);
    addParagraph('3.1 . Caixa Econômica Federal: A abertura de conta será realizada para fins de averbação da margem consignável, conforme liberação das parcelas pelos bancos. [cite: 16] Esta conta será utilizada também para TED dos valores, garantindo segurança para a empresa intermediadora e para o cliente. [cite: 17] O cliente deverá, ainda, assinar e reconhecer firma do documento da TED, que será emitido com os valores das transferências.', false, true); // [cite: 18]
    skipLines(1);
    addParagraph('3.2. Bradesco S.A: A abertura de conta será exigida para aprovação e pagamento do contrato. [cite: 19] O banco solicita a abertura para que todos os aceites sejam realizados via aplicativo.', false, true); // [cite: 20]
    skipLines(1);
    addParagraph('Parágrafo Único: Tenho ciência de que o banco pode levar de 7 (sete) a 10 (dez) dias para liberar a margem para averbação da proposta. [cite: 21] Passado esse prazo, será feita cobrança ao banco. Autorizo o uso da minha senha do SOU GOV e do e-mail, exclusivamente para fins de consulta da margem consignável e eventuais autorizações, com a minha ciência.'); // [cite: 22]
    skipLines(1);
    addParagraph('Ciente das informações acima e do disposto no parágrafo único, no qual preciso fornecer a senha do SOU GOV e email, assino abaixo:'); // [cite: 23]
    skipLines(3);
    addLine('ASSINATURA DO DEVEDOR: _________________________________________', false, 'left', true); // [cite: 24]
    skipLines(2);

    // CLÁUSULA QUARTA
    addLine('CLÁUSULA QUARTA – DAS CONDIÇÕES DA OPERAÇÃO', true); // [cite: 25]
    skipLines(1);
    addParagraph('4.1. Declaro estar ciente de que, uma vez assinada esta transação, será realizada a quitação dos contratos indicados, não sendo possível o cancelamento ou desistência da operação junto à nova instituição financeira até sua completa finalização.', false, true); // [cite: 26]
    skipLines(2);

    // CLÁUSULA QUINTA
    addLine('CLÁUSULA QUINTA – DAS TESTEMUNHAS', true); // [cite: 27]
    skipLines(1);
    addParagraph('5.1. Para contratos de clientes com idade superior a 60 (sessenta) anos, conforme a Lei nº 14.423, de 22 de julho de 2022, será exigida a assinatura de uma testemunha de primeiro grau com vínculo familiar com o cliente.', false, true); // [cite: 27]
    skipLines(1);
    addParagraph('5.2. Na ausência de parente próximo ou caso o cliente opte por não contar com testemunha, será necessário o envio de um vídeo, no qual o cliente declare plena ciência do contrato e manifeste sua decisão de não ter testemunha. [cite: 28] Esse vídeo deverá ser anexado à documentação da operação para fins de formalização.', false, true); // [cite: 29]
    skipLines(1);
    addParagraph('Parágrafo Único: Comprometo-me a não utilizar a margem consignável correspondente ao contrato quitado em outra consignatária, devendo a mesma permanecer disponível até a conclusão da operação e contratação do novo contrato, intermediado pela Aliança Consig de Seguros Ltda., na instituição financeira que oferecer a melhor condição disponível no dia ou conforme indicação da empresa, respeitando meu perfil de crédito. [cite: 30] Essa conduta visa manter a boa-fé na negociação, conforme a legislação vigente. [cite: 31]');
    skipLines(2);

    // CLÁUSULA SEXTA
    addLine('CLÁUSULA SEXTA – DA RESPONSABILIDADE CIVIL E PENAL', true); // [cite: 31]
    skipLines(1);
    addParagraph('6.1. Declaro ter pleno conhecimento do conteúdo deste instrumento. Em caso de uso indevido da margem liberada junto a outra instituição financeira, estarei sujeito à responsabilização por eventual crime, que poderá ser comunicado às autoridades competentes.', false, true); // [cite: 32]
    skipLines(4);

    // --- 5. ASSINATURAS E RODAPÉ ---
    
    // Data
    addLine(local_data, false, 'left'); // [cite: 37]
    skipLines(5);

    // Assinatura do Credor
    addLine('_________________________________________', false, 'center'); // [cite: 33]
    addLine('Alianca Consig. Alianca Solucoes em Negocios LTDA', false, 'center'); // [cite: 36]
    addLine('ASSINATURA DO CREDOR', false, 'center');
    skipLines(3);
    
    // Assinatura do Devedor
    addLine('_________________________________________', false, 'center'); // [cite: 34]
    addLine(nome, false, 'center');
    addLine('ASSINATURA DO DEVEDOR', false, 'center');
    skipLines(3);

    // Assinatura da Testemunha
    addLine('_________________________________________', false, 'center');
    addLine(`TESTEMUNHA: ${testemunha_nome}`, false, 'center'); // [cite: 35]
    addLine('(Grau de Parentesco): ________________', false, 'center'); // [cite: 35]
    skipLines(5);

    // --- 6. SALVAR O ARQUIVO ---
    doc.save(`Confissao_Divida_${nome.replace(/ /g, '_')}.pdf`);
}