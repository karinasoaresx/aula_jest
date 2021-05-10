// subir o servidor no supertest
// criar variavel de ambiente para rodas o teste do bd de teste

const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/database");
const {cpf} = require("cpf-cnpj-validator");
const truncate = require("./truncate");

describe("MANAGERS", () => {

    afterAll(() => {
        connection.close();
    });

    beforeEach(async (done) => {
        await truncate(connection.models);
        done();
    });

    it("é possivel criar um novo gerente", async () => {
        const response = await request(app).post("/managers").send({
            name: "karina soares",
            cpf: cpf.generate(),
            email: "karina@gmail.com",
            cellphone: "9762345003214",
            password: "123456",
        });

        expect(response.ok).toBeTruthy();
        expect(response.body).toHaveProperty("id");
    });

    it("não é possivel cadastrar um gerente com cpf existente", async () => {
        let cpfGerente = cpf.generate();
        let response = await request(app).post("/managers").send({
            name: "karina soares",
            cpf: cpfGerente,
            email: "karina@gmail.com",
            cellphone: "9762345003214",
            password: "123456",
        });

        response = await request(app).post("/managers").send({
            name: "karina silva",
            cpf: cpfGerente,
            email: "karina123@gmail.com",
            cellphone: "9762345003214",
            password: "123456",
        });

        expect(response.ok).toBeFalsy();
        expect(response.body).toHaveProperty("error");
        expect(response.body).toEqual("cpf already exists");

    });
});