import React from "react";
import { Link } from "react-router-dom";

/** Keeps one broken game from taking the whole app down. */
export default class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("Game crashed:", error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="page narrow">
        <div className="info-card">
          <h1>Something went wrong</h1>
          <p>This game hit an unexpected error. Your saved progress is safe.</p>
          <div className="button-row">
            <button className="primary-btn" onClick={() => this.setState({ error: null })}>Try again</button>
            <Link className="secondary-btn" to="/games">Back to games</Link>
          </div>
        </div>
      </section>
    );
  }
}
