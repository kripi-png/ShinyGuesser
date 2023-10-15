var ge = Object.defineProperty;
var be = (e, t, n) =>
	t in e
		? ge(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
		: (e[t] = n);
var R = (e, t, n) => (be(e, typeof t != 'symbol' ? t + '' : t, n), n);
(function () {
	const t = document.createElement('link').relList;
	if (t && t.supports && t.supports('modulepreload')) return;
	for (const o of document.querySelectorAll('link[rel="modulepreload"]')) r(o);
	new MutationObserver((o) => {
		for (const i of o)
			if (i.type === 'childList')
				for (const c of i.addedNodes)
					c.tagName === 'LINK' && c.rel === 'modulepreload' && r(c);
	}).observe(document, { childList: !0, subtree: !0 });
	function n(o) {
		const i = {};
		return (
			o.integrity && (i.integrity = o.integrity),
			o.referrerPolicy && (i.referrerPolicy = o.referrerPolicy),
			o.crossOrigin === 'use-credentials'
				? (i.credentials = 'include')
				: o.crossOrigin === 'anonymous'
				? (i.credentials = 'omit')
				: (i.credentials = 'same-origin'),
			i
		);
	}
	function r(o) {
		if (o.ep) return;
		o.ep = !0;
		const i = n(o);
		fetch(o.href, i);
	}
})();
function h() {}
function ce(e) {
	return e();
}
function re() {
	return Object.create(null);
}
function C(e) {
	e.forEach(ce);
}
function le(e) {
	return typeof e == 'function';
}
function U(e, t) {
	return e != e
		? t == t
		: e !== t || (e && typeof e == 'object') || typeof e == 'function';
}
let j;
function oe(e, t) {
	return e === t
		? !0
		: (j || (j = document.createElement('a')), (j.href = t), e === j.href);
}
function $e(e) {
	return Object.keys(e).length === 0;
}
function ke(e, ...t) {
	if (e == null) {
		for (const r of t) r(void 0);
		return h;
	}
	const n = e.subscribe(...t);
	return n.unsubscribe ? () => n.unsubscribe() : n;
}
function ye(e, t, n) {
	e.$$.on_destroy.push(ke(t, n));
}
function l(e, t) {
	e.appendChild(t);
}
function fe(e, t, n) {
	e.insertBefore(t, n || null);
}
function V(e) {
	e.parentNode && e.parentNode.removeChild(e);
}
function _(e) {
	return document.createElement(e);
}
function P(e) {
	return document.createTextNode(e);
}
function L() {
	return P(' ');
}
function se(e, t, n, r) {
	return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
}
function d(e, t, n) {
	n == null
		? e.removeAttribute(t)
		: e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function we(e) {
	return Array.from(e.childNodes);
}
function F(e, t) {
	(t = '' + t), e.data !== t && (e.data = t);
}
let D;
function A(e) {
	D = e;
}
const v = [],
	ie = [];
let x = [];
const ue = [],
	Pe = Promise.resolve();
let K = !1;
function ve() {
	K || ((K = !0), Pe.then(ae));
}
function T(e) {
	x.push(e);
}
const G = new Set();
let y = 0;
function ae() {
	if (y !== 0) return;
	const e = D;
	do {
		try {
			for (; y < v.length; ) {
				const t = v[y];
				y++, A(t), xe(t.$$);
			}
		} catch (t) {
			throw ((v.length = 0), (y = 0), t);
		}
		for (A(null), v.length = 0, y = 0; ie.length; ) ie.pop()();
		for (let t = 0; t < x.length; t += 1) {
			const n = x[t];
			G.has(n) || (G.add(n), n());
		}
		x.length = 0;
	} while (v.length);
	for (; ue.length; ) ue.pop()();
	(K = !1), G.clear(), A(e);
}
function xe(e) {
	if (e.fragment !== null) {
		e.update(), C(e.before_update);
		const t = e.dirty;
		(e.dirty = [-1]),
			e.fragment && e.fragment.p(e.ctx, t),
			e.after_update.forEach(T);
	}
}
function Se(e) {
	const t = [],
		n = [];
	x.forEach((r) => (e.indexOf(r) === -1 ? t.push(r) : n.push(r))),
		n.forEach((r) => r()),
		(x = t);
}
const B = new Set();
let Ne;
function de(e, t) {
	e && e.i && (B.delete(e), e.i(t));
}
function Ee(e, t, n, r) {
	if (e && e.o) {
		if (B.has(e)) return;
		B.add(e),
			Ne.c.push(() => {
				B.delete(e), r && (n && e.d(1), r());
			}),
			e.o(t);
	} else r && r();
}
function Oe(e) {
	e && e.c();
}
function me(e, t, n) {
	const { fragment: r, after_update: o } = e.$$;
	r && r.m(t, n),
		T(() => {
			const i = e.$$.on_mount.map(ce).filter(le);
			e.$$.on_destroy ? e.$$.on_destroy.push(...i) : C(i), (e.$$.on_mount = []);
		}),
		o.forEach(T);
}
function pe(e, t) {
	const n = e.$$;
	n.fragment !== null &&
		(Se(n.after_update),
		C(n.on_destroy),
		n.fragment && n.fragment.d(t),
		(n.on_destroy = n.fragment = null),
		(n.ctx = []));
}
function Le(e, t) {
	e.$$.dirty[0] === -1 && (v.push(e), ve(), e.$$.dirty.fill(0)),
		(e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
}
function he(e, t, n, r, o, i, c = null, u = [-1]) {
	const f = D;
	A(e);
	const s = (e.$$ = {
		fragment: null,
		ctx: [],
		props: i,
		update: h,
		not_equal: o,
		bound: re(),
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(t.context || (f ? f.$$.context : [])),
		callbacks: re(),
		dirty: u,
		skip_bound: !1,
		root: t.target || f.$$.root,
	});
	c && c(s.root);
	let S = !1;
	if (
		((s.ctx = n
			? n(e, t.props || {}, (a, g, ...b) => {
					const N = b.length ? b[0] : g;
					return (
						s.ctx &&
							o(s.ctx[a], (s.ctx[a] = N)) &&
							(!s.skip_bound && s.bound[a] && s.bound[a](N), S && Le(e, a)),
						g
					);
			  })
			: []),
		s.update(),
		(S = !0),
		C(s.before_update),
		(s.fragment = r ? r(s.ctx) : !1),
		t.target)
	) {
		if (t.hydrate) {
			const a = we(t.target);
			s.fragment && s.fragment.l(a), a.forEach(V);
		} else s.fragment && s.fragment.c();
		t.intro && de(e.$$.fragment), me(e, t.target, t.anchor), ae();
	}
	A(f);
}
class _e {
	constructor() {
		R(this, '$$');
		R(this, '$$set');
	}
	$destroy() {
		pe(this, 1), (this.$destroy = h);
	}
	$on(t, n) {
		if (!le(n)) return h;
		const r = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
		return (
			r.push(n),
			() => {
				const o = r.indexOf(n);
				o !== -1 && r.splice(o, 1);
			}
		);
	}
	$set(t) {
		this.$$set &&
			!$e(t) &&
			((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
	}
}
const Ae = '4';
typeof window < 'u' &&
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(Ae);
const w = [];
function Ce(e, t = h) {
	let n;
	const r = new Set();
	function o(u) {
		if (U(e, u) && ((e = u), n)) {
			const f = !w.length;
			for (const s of r) s[1](), w.push(s, e);
			if (f) {
				for (let s = 0; s < w.length; s += 2) w[s][0](w[s + 1]);
				w.length = 0;
			}
		}
	}
	function i(u) {
		o(u(e));
	}
	function c(u, f = h) {
		const s = [u, f];
		return (
			r.add(s),
			r.size === 1 && (n = t(o, i) || h),
			u(e),
			() => {
				r.delete(s), r.size === 0 && n && (n(), (n = null));
			}
		);
	}
	return { set: o, update: i, subscribe: c };
}
const Ie = () => {
		const {
				subscribe: e,
				set: t,
				update: n,
			} = Ce({ streak: 0, currentPokemon: null }),
			r = () => {
				n((c) => (c.streak++, c));
			},
			o = () => {
				n((c) => ((c.streak = 0), c));
			},
			i = async () => {
				const u = await (await fetch('http://localhost:8000/pokemon')).json();
				console.log('new pokemon', { ...u }),
					n((f) => ((f.currentPokemon = u), f));
			};
		return (
			i(),
			{
				subscribe: e,
				set: t,
				update: n,
				increaseStreak: r,
				resetStreak: o,
				getNewPokemon: i,
			}
		);
	},
	q = Ie();
function je(e) {
	var X, Y;
	let t,
		n,
		r,
		o,
		i,
		c,
		u,
		f = ((X = e[0].currentPokemon) == null ? void 0 : X.pokemonId) + '',
		s,
		S,
		a,
		g = ((Y = e[0].currentPokemon) == null ? void 0 : Y.pokemonName) + '',
		b,
		N,
		E,
		H,
		I = e[0].streak + '',
		z,
		J,
		O,
		$,
		Q,
		k,
		M,
		W;
	return {
		c() {
			var m, p;
			(t = _('div')),
				(n = _('img')),
				(i = L()),
				(c = _('h1')),
				(u = P('#')),
				(s = P(f)),
				(S = L()),
				(a = _('span')),
				(b = P(g)),
				(N = L()),
				(E = _('h1')),
				(H = P('Streak: ')),
				(z = P(I)),
				(J = L()),
				(O = _('div')),
				($ = _('button')),
				($.textContent = 'Regular'),
				(Q = L()),
				(k = _('button')),
				(k.textContent = 'Shiny'),
				oe(
					n.src,
					(r = (m = e[0].currentPokemon) == null ? void 0 : m.sprite)
				) || d(n, 'src', r),
				d(
					n,
					'alt',
					(o = (p = e[0].currentPokemon) == null ? void 0 : p.pokemonName)
				),
				d(n, 'width', '500px'),
				d(a, 'class', 'font-bold'),
				d(c, 'class', 'text-3xl'),
				d(E, 'class', 'text-4xl'),
				d($, 'type', 'button'),
				d($, 'class', 'btn variant-filled'),
				d(k, 'type', 'button'),
				d(k, 'class', 'btn variant-filled-secondary'),
				d(t, 'class', 'flex flex-col items-center');
		},
		m(m, p) {
			fe(m, t, p),
				l(t, n),
				l(t, i),
				l(t, c),
				l(c, u),
				l(c, s),
				l(c, S),
				l(c, a),
				l(a, b),
				l(t, N),
				l(t, E),
				l(E, H),
				l(E, z),
				l(t, J),
				l(t, O),
				l(O, $),
				l(O, Q),
				l(O, k),
				M || ((W = [se($, 'click', e[2]), se(k, 'click', e[3])]), (M = !0));
		},
		p(m, [p]) {
			var Z, ee, te, ne;
			p & 1 &&
				!oe(
					n.src,
					(r = (Z = m[0].currentPokemon) == null ? void 0 : Z.sprite)
				) &&
				d(n, 'src', r),
				p & 1 &&
					o !==
						(o =
							(ee = m[0].currentPokemon) == null ? void 0 : ee.pokemonName) &&
					d(n, 'alt', o),
				p & 1 &&
					f !==
						(f =
							((te = m[0].currentPokemon) == null ? void 0 : te.pokemonId) +
							'') &&
					F(s, f),
				p & 1 &&
					g !==
						(g =
							((ne = m[0].currentPokemon) == null ? void 0 : ne.pokemonName) +
							'') &&
					F(b, g),
				p & 1 && I !== (I = m[0].streak + '') && F(z, I);
		},
		i: h,
		o: h,
		d(m) {
			m && V(t), (M = !1), C(W);
		},
	};
}
function qe(e, t, n) {
	let r;
	ye(e, q, (u) => n(0, (r = u)));
	const o = (u) => {
		r.currentPokemon &&
			(u ? q.increaseStreak() : q.resetStreak(), q.getNewPokemon());
	};
	return [
		r,
		o,
		() => {
			var u;
			return o(!((u = r.currentPokemon) != null && u.isShiny));
		},
		() => {
			var u;
			return o((u = r.currentPokemon) == null ? void 0 : u.isShiny);
		},
	];
}
class Be extends _e {
	constructor(t) {
		super(), he(this, t, qe, je, U, {});
	}
}
function ze(e) {
	let t, n, r;
	return (
		(n = new Be({})),
		{
			c() {
				(t = _('div')), Oe(n.$$.fragment);
			},
			m(o, i) {
				fe(o, t, i), me(n, t, null), (r = !0);
			},
			p: h,
			i(o) {
				r || (de(n.$$.fragment, o), (r = !0));
			},
			o(o) {
				Ee(n.$$.fragment, o), (r = !1);
			},
			d(o) {
				o && V(t), pe(n);
			},
		}
	);
}
class Me extends _e {
	constructor(t) {
		super(), he(this, t, null, ze, U, {});
	}
}
new Me({ target: document.getElementById('app') });