/**
 * Graphology Iteration Specs
 * ===========================
 *
 * Testing the iteration-related methods of the graph.
 */
import assert from 'assert';
import take from 'obliterator/take';
import nodes from './nodes';
import edges from './edges';
import neighbors from './neighbors';

export default function iteration(Graph, checkers) {
  return {
    Adjacency: {

      'it should be possible to iterate over the graph\'s adjacency using callbacks.': function() {
        const graph = new Graph();

        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);

        graph.addEdge(1, 2);
        graph.addEdge(2, 3);
        graph.addEdge(3, 1);
        graph.addUndirectedEdge(1, 2);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adjacency = [];

        graph.forEach(function(s, t, sa, ta, e, ea, u, g) {
          adjacency.push([u, s, t]);
          assert.deepStrictEqual(sa, graph.getNodeAttributes(s));
          assert.deepStrictEqual(ta, graph.getNodeAttributes(t));
          assert.deepStrictEqual(ea, graph.getEdgeAttributes(e));
          assert.strictEqual(graph.isUndirected(e), u);
          assert.strictEqual(graph.hasGeneratedKey(e), g);
        });

        assert.deepStrictEqual(adjacency, [
          [false, '1', '2'],
          [true, '1', '2'],
          [false, '2', '3'],
          [true, '2', '1'],
          [false, '3', '1']
        ]);
      },

      'it should be possible to iterate over a multi graph\'s adjacency using callbacks.': function() {
        const graph = new Graph({multi: true});

        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);

        graph.addEdge(1, 2);
        graph.addEdge(2, 3);
        graph.addEdge(3, 1);
        graph.addEdgeWithKey('test', 2, 3);
        graph.addUndirectedEdge(1, 2);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adjacency = [];

        graph.forEach(function(s, t, sa, ta, e, ea, u, g) {
          adjacency.push([u, s, t]);
          assert.deepStrictEqual(sa, graph.getNodeAttributes(s));
          assert.deepStrictEqual(ta, graph.getNodeAttributes(t));
          assert.deepStrictEqual(ea, graph.getEdgeAttributes(e));
          assert.strictEqual(graph.isUndirected(e), u);
          assert.strictEqual(graph.hasGeneratedKey(e), g);

          if (!g)
            assert.strictEqual(e, 'test');
        });

        assert.deepStrictEqual(adjacency, [
          [false, '1', '2'],
          [true, '1', '2'],
          [false, '2', '3'],
          [false, '2', '3'],
          [true, '2', '1'],
          [false, '3', '1']
        ]);
      },

      'it should be possible to iterate over the graph\'s adjacency using callbacks until returning true.': function() {
        const graph = new Graph();

        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);

        graph.addEdge(1, 2);
        graph.addEdge(2, 3);
        graph.addEdge(3, 1);
        graph.addUndirectedEdge(1, 2);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adjacency = [];

        graph.forEachUntil(function(s, t, sa, ta, e, ea, u, g) {
          adjacency.push([u, s, t]);
          assert.deepStrictEqual(sa, graph.getNodeAttributes(s));
          assert.deepStrictEqual(ta, graph.getNodeAttributes(t));
          assert.deepStrictEqual(ea, graph.getEdgeAttributes(e));
          assert.strictEqual(graph.isUndirected(e), u);
          assert.strictEqual(graph.hasGeneratedKey(e), g);

          if (sa.hello === 'world')
            return true;
        });

        assert.deepStrictEqual(adjacency, [
          [false, '1', '2'],
          [true, '1', '2'],
          [false, '2', '3']
        ]);
      },

      'it should be possible to create an iterator over the graph\'s adjacency.': function() {
        const edgeKeyGenerator = ({undirected, source, target}) => {
          return `${source}${undirected ? '--' : '->'}${target}`;
        };

        const graph = new Graph({edgeKeyGenerator});

        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);

        graph.addEdge(1, 2);
        graph.addEdge(2, 3);
        graph.addEdge(3, 1);
        graph.addUndirectedEdge(1, 2);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adj = take(graph.adjacency())
          .map(p => [p[0], p[1], p[4]]);

        assert.deepStrictEqual(adj, [
          ['1', '2', '1->2'],
          ['1', '2', '1--2'],
          ['2', '3', '2->3'],
          ['2', '1', '1--2'],
          ['3', '1', '3->1']
        ]);
      },

      'it should be possible to create an iterator over a multi graph\'s adjacency.': function() {
        const graph = new Graph({multi: true});

        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);

        graph.addEdgeWithKey(0, 1, 2);
        graph.addEdgeWithKey(1, 2, 3);
        graph.addEdgeWithKey(2, 3, 1);
        graph.addEdgeWithKey(3, 2, 3);
        graph.addUndirectedEdgeWithKey(4, 1, 2);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adj = take(graph.adjacency())
          .map(p => [p[0], p[1], p[4]]);

        assert.deepStrictEqual(adj, [
          ['1', '2', '0'],
          ['1', '2', '4'],
          ['2', '3', '1'],
          ['2', '3', '3'],
          ['2', '1', '4'],
          ['3', '1', '2']
        ]);
      },

      'it should be possible to iterate via Symbol.iterator.': function() {
        if (typeof Symbol === 'undefined')
          return;

        const edgeKeyGenerator = ({undirected, source, target}) => {
          return `${source}${undirected ? '--' : '->'}${target}`;
        };

        const graph = new Graph({edgeKeyGenerator});

        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);

        graph.addEdge(1, 2);
        graph.addEdge(2, 3);
        graph.addEdge(3, 1);
        graph.addUndirectedEdge(1, 2);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adj = take(graph[Symbol.iterator]())
          .map(p => [p[0], p[1], p[4]]);

        assert.deepStrictEqual(adj, [
          ['1', '2', '1->2'],
          ['1', '2', '1--2'],
          ['2', '3', '2->3'],
          ['2', '1', '1--2'],
          ['3', '1', '3->1']
        ]);
      }
    },
    Nodes: nodes(Graph, checkers),
    Edges: edges(Graph, checkers),
    Neighbors: neighbors(Graph, checkers)
  };
}
