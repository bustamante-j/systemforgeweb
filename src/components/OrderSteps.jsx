import { orderSteps } from '../data/site'

export default function OrderSteps() {
  return (
    <ol className="order-steps">
      {orderSteps.map((step, index) => (
        <li className="order-step" key={step.title}>
          <span className="order-step-number" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="order-step-body">
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
            {step.items ? (
              <ul
                aria-label={`What to send for step ${index + 1}`}
                className="plain-list order-step-items"
              >
                {step.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
