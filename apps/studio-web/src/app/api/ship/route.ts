import { NextRequest, NextResponse } from 'next/server';
import { RestateDispatchPayloadSchema, RestateDispatchResponse } from '@getshipped/shared-types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate payload against schema
    const parsedPayload = RestateDispatchPayloadSchema.safeParse(body);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          error: 'Invalid Restate dispatch payload',
          details: parsedPayload.error.format(),
        },
        { status: 400 }
      );
    }

    const { launchPackId, version, approvedBy, channels, videoConfig } = parsedPayload.data;
    const workflowId = `restate_saga_${Date.now()}`;
    const restateInvocationId = `inv_${Math.random().toString(36).substring(2, 10)}`;

    const response: RestateDispatchResponse = {
      workflowId,
      restateInvocationId,
      status: 'running',
      channels: channels.map((ch) => ({
        channel: ch,
        status: 'queued',
        progress: 0,
        message: `Queued in Restate durable execution cluster for ${ch}`,
        executionId: `exec_${ch}_${Date.now()}`,
      })),
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Restate saga workflow ${workflowId} initiated by ${approvedBy} for release ${version}`,
        },
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Video target configured: ${videoConfig.aspectRatio} @ ${videoConfig.fps}fps (${videoConfig.codec})`,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: String(err) },
      { status: 500 }
    );
  }
}
