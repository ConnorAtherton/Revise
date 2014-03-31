// e.g. Utils.m_to_s(6) => 3600
Utils = {
  m_to_ms: function (m) {
    return m * 60 * 1000;
  },

  m_to_s: function (m) {
    return m * 60;
  },

  s_to_m: function (s) {
    return s / 60;
  },

  ms_to_s: function (ms) {
    return ms / 1000;
  },

  s_to_ms: function (s) {
    return s * 1000;
  }
}
