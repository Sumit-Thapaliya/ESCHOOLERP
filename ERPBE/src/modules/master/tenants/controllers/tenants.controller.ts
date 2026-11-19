import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPlatformAuth } from '../../../../common/swagger/api-auth.decorators';
import { ApiEnvelope, ApiErrors } from '../../../../common/swagger/api-response.decorators';
import { PlatformAuthGuard, type PlatformRequest } from '../../platform-auth/platform-auth.guard';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { PublicTenantConfigDto, TenantViewDto } from '../dto/tenant.response.dto';
import { UpdateBrandingDto } from '../dto/update-branding.dto';
import { BrandingService } from '../services/branding.service';
import { BrandingUploadService } from '../services/branding-upload.service';
import { TenantProvisioningService } from '../services/tenant-provisioning.service';
import { TenantsService } from '../services/tenants.service';

@ApiTags('Tenants')
@ApiPlatformAuth()
@Controller('tenants')
@UseGuards(PlatformAuthGuard)
export class TenantsController {
  constructor(
    private svc: TenantsService,
    private provisioning: TenantProvisioningService,
    private branding: BrandingService,
    private brandingUpload: BrandingUploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List schools (newest first)' })
  @ApiEnvelope(TenantViewDto, { isArray: true })
  list() {
    return this.svc.list();
  }

 /** Creates the tenant and its first principal. Retrying with the same slug resumes a failed attempt. */
 
  @Post()
  @ApiOperation({
    summary: 'Create a school',
    description:
      'Creates a dedicated Postgres role + database, runs tenant migrations and creates the first principal (top role) ' +
      '(must change password at first login; OTP to principalEmail). On 500 the school is marked failed: send the same request again to retry.',
  })
  @ApiEnvelope(TenantViewDto, { status: 201, description: 'School created and active' })
  @ApiErrors({
    400: 'Validation failed, or invalid/reserved slug',
    409: 'Slug taken, or provisioning already in progress',
    500: 'Provisioning failed. Retry with the same slug.',
  })
  create(@Body() dto: CreateTenantDto, @Req() req: PlatformRequest) {
    return this.provisioning.create(dto, req.platformUser.id);
  }

  @Post(':id/branding/image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 } }))
  @ApiOperation({ summary: 'Upload a branding image' })
  uploadBrandingImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file?: { buffer: Buffer; size: number; mimetype: string }) {
    return this.brandingUpload.upload(id, file);
  }

  @Put(':id/branding')
  @ApiOperation({ summary: 'Publish branding', description: 'PUT semantics: omitted optional fields reset to defaults.' })
  @ApiEnvelope(PublicTenantConfigDto)
  @ApiErrors({ 400: 'Validation failed (logo/favicon must be https)', 404: 'Tenant not found' })
  publishBranding(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBrandingDto,
    @Req() req: PlatformRequest,
  ) {
    return this.branding.publish(id, dto, req.platformUser.id);
  }
}
