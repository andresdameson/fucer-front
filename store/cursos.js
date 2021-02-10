export const state = () => ({
  byId: {},
  idsByFilter: {
    todos: [],
    activos: [],
    finalizados: [],
  },
  todos: false,
});

export const mutations = {
  RECEIVE_CURSOS(state, { response, filter = "" }) {
    const byId = { ...state.byId };
    response.forEach((curso) => {
      byId[curso.id] = curso;
    });
    state.byId = byId;

    switch (filter) {
      case "activos":
      case "finalizados":
        state.idsByFilter[filter] = response.map((curso) => curso.id);
        break;
    }
  },
};

export const actions = {
  async getById({ commit }, id) {
    const curso = await this.$api.cursos.getById(id);
    commit("RECEIVE_CURSOS", {
      response: normalizarCursos([curso]),
    });
  },
  async getActivos({ commit }) {
    const cursos = await this.$api.cursos.usuario(false);
    commit("RECEIVE_CURSOS", {
      response: normalizarCursos(cursos),
      filter: "activos",
    });
  },
  async getFinalizados({ commit }) {
    const cursos = await this.$api.cursos.usuario(true);
    commit("RECEIVE_CURSOS", {
      response: normalizarCursos(cursos),
      filter: "finalizados",
    });
  },
};

export const getters = {
  activos: (state) => state.idsByFilter.activos.map((id) => state.byId[id]),
  finalizados: (state) =>
    state.idsByFilter.finalizados.map((id) => state.byId[id]),
};

// Utils
const normalizarCursos = (cursos) => {
  return cursos.map((item) => ({
    ...item,
    url: {
      name: "curso-id",
      params: {
        id: item.id,
      },
    },
  }));
};
